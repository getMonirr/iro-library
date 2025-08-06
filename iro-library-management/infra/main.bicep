targetScope = 'resourceGroup'

// Parameters
@description('The name of the environment (e.g., dev, staging, prod)')
param environmentName string = 'dev'

@description('The location for all resources')
param location string = resourceGroup().location

@description('The name of the project')
param projectName string = 'iro-library'

// Variables
var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))
var abbrs = loadJsonContent('abbreviations.json')

// Container Apps Environment
resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: '${abbrs.appManagedEnvironments}${projectName}-${environmentName}-${resourceToken}'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalyticsWorkspace.properties.customerId
        sharedKey: logAnalyticsWorkspace.listKeys().primarySharedKey
      }
    }
  }
  tags: {
    'azd-env-name': environmentName
  }
}

// Log Analytics Workspace
resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: '${abbrs.operationalInsightsWorkspaces}${projectName}-${environmentName}-${resourceToken}'
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
  tags: {
    'azd-env-name': environmentName
  }
}

// Container Registry
resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: '${abbrs.containerRegistryRegistries}${projectName}${environmentName}${resourceToken}'
  location: location
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: true
  }
  tags: {
    'azd-env-name': environmentName
  }
}

// User Assigned Managed Identity
resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: '${abbrs.managedIdentityUserAssignedIdentities}${projectName}-${environmentName}-${resourceToken}'
  location: location
  tags: {
    'azd-env-name': environmentName
  }
}

// Role assignment for Container Registry
resource containerRegistryAccess 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: containerRegistry
  name: guid(containerRegistry.id, managedIdentity.id, subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d'))
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d')
    principalId: managedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

// Cosmos DB Account for MongoDB API
resource cosmosDbAccount 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: '${abbrs.documentDBDatabaseAccounts}${projectName}-${environmentName}-${resourceToken}'
  location: location
  kind: 'MongoDB'
  properties: {
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    databaseAccountOfferType: 'Standard'
    apiProperties: {
      serverVersion: '4.2'
    }
    capabilities: [
      {
        name: 'EnableMongo'
      }
    ]
  }
  tags: {
    'azd-env-name': environmentName
  }
}

// Cosmos DB Database
resource cosmosDbDatabase 'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases@2023-04-15' = {
  parent: cosmosDbAccount
  name: 'iro-library'
  properties: {
    resource: {
      id: 'iro-library'
    }
  }
}

// Backend Container App
resource backendContainerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: '${abbrs.appContainerApps}${projectName}-backend-${environmentName}-${resourceToken}'
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  properties: {
    managedEnvironmentId: containerAppsEnvironment.id
    configuration: {
      ingress: {
        external: true
        targetPort: 5000
        corsPolicy: {
          allowedOrigins: ['*']
          allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
          allowedHeaders: ['*']
        }
      }
      registries: [
        {
          server: containerRegistry.properties.loginServer
          identity: managedIdentity.id
        }
      ]
      secrets: [
        {
          name: 'mongodb-uri'
          value: 'mongodb://${cosmosDbAccount.name}:${cosmosDbAccount.listKeys().primaryMasterKey}@${cosmosDbAccount.properties.documentEndpoint}:10255/iro-library?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@${cosmosDbAccount.name}@'
        }
        {
          name: 'jwt-secret'
          value: 'your-super-secret-jwt-key-${resourceToken}'
        }
        {
          name: 'jwt-refresh-secret'
          value: 'your-refresh-token-secret-${resourceToken}'
        }
      ]
    }
    template: {
      containers: [
        {
          image: '${containerRegistry.properties.loginServer}/${projectName}-backend:latest'
          name: 'backend'
          env: [
            {
              name: 'NODE_ENV'
              value: 'production'
            }
            {
              name: 'PORT'
              value: '5000'
            }
            {
              name: 'MONGODB_URI'
              secretRef: 'mongodb-uri'
            }
            {
              name: 'JWT_SECRET'
              secretRef: 'jwt-secret'
            }
            {
              name: 'JWT_EXPIRE'
              value: '7d'
            }
            {
              name: 'JWT_REFRESH_SECRET'
              secretRef: 'jwt-refresh-secret'
            }
            {
              name: 'JWT_REFRESH_EXPIRE'
              value: '30d'
            }
          ]
          resources: {
            cpu: json('0.5')
            memory: '1.0Gi'
          }
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 3
      }
    }
  }
  tags: {
    'azd-env-name': environmentName
  }
}

// Static Web App for User Site
resource userSiteStaticWebApp 'Microsoft.Web/staticSites@2022-09-01' = {
  name: '${abbrs.webStaticSites}${projectName}-user-${environmentName}-${resourceToken}'
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    buildProperties: {
      skipGithubActionWorkflowGeneration: true
    }
  }
  tags: {
    'azd-env-name': environmentName
  }
}

// Static Web App for Admin Site
resource adminSiteStaticWebApp 'Microsoft.Web/staticSites@2022-09-01' = {
  name: '${abbrs.webStaticSites}${projectName}-admin-${environmentName}-${resourceToken}'
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    buildProperties: {
      skipGithubActionWorkflowGeneration: true
    }
  }
  tags: {
    'azd-env-name': environmentName
  }
}

// Outputs
output BACKEND_API_URL string = 'https://${backendContainerApp.properties.configuration.ingress.fqdn}'
output USER_SITE_URL string = 'https://${userSiteStaticWebApp.properties.defaultHostname}'
output ADMIN_SITE_URL string = 'https://${adminSiteStaticWebApp.properties.defaultHostname}'
output CONTAINER_REGISTRY_LOGIN_SERVER string = containerRegistry.properties.loginServer
output COSMOS_DB_CONNECTION_STRING string = 'mongodb://${cosmosDbAccount.name}:${cosmosDbAccount.listKeys().primaryMasterKey}@${cosmosDbAccount.properties.documentEndpoint}:10255/iro-library?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@${cosmosDbAccount.name}@'
