---
sidebar_position: 0
---

# Guide

## Introduction

This guide walks through deploying the [cloud-cap-samples-java](https://github.com/SAP-samples/cloud-cap-samples-java) to a Cloud Foundry environment on SAP Business Technology Platform (BTP) — using Infrastructure as Data.

> "The _Cloud Application Programming Model_ (CAP) is a framework of languages, libraries, and tools for building enterprise-grade cloud applications." - https://cap.cloud.sap/docs/get-started/features#what-is-cap

Rather than repeating what the individual Crossplane provider documentation already covers, it links to the relevant sections and adds additional context where needed.

:::info
cloud-cap-samples-java can also be [deployed to a Kyma runtime on SAP BTP](https://github.com/SAP-samples/cloud-cap-samples-java#deploy-to-sap-business-technology-platform-kyma-runtime). This is not yet covered in this guide. Please don't hesitate to [contribute](/docs/contribution/solve-tickets#shared-documentation)!
:::

## 🚧 Prerequisites

- You have a running control plane.
- You have cloned [cloud-cap-samples-java](https://github.com/SAP-samples/cloud-cap-samples-java) to your local machine.

## Procedure

### BTP

1. [Install](/docs/crossplane-provider-btp/docs/end-user-guides/setup/install-provider-btp#procedure) and [configure](/docs/crossplane-provider-btp/docs/end-user-guides/setup/configure-provider-btp#set-up-the-sap-cloud-management-service) the BTP provider

<details>
<summary>`Provider`, `Secret` (×2) and `ProviderConfig`</summary>

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: btp-provider
spec:
  package: ghcr.io/sap/crossplane-provider-btp/crossplane/provider-btp:<version> # replace <version> with the desired version, e.g. 1.0.2
  packagePullSecrets:
    - name: artifactory-readonly-docker
---
apiVersion: v1
kind: Secret
metadata:
    namespace: default
    name: cis-provider-secret
type: Opaque
stringData:
    data: |
        {
          "endpoints": {
            "accounts_service_url": "...",
            "cloud_automation_url": "...",
            "entitlements_service_url": "...",
            "events_service_url": "...",
            "external_provider_registry_url": "...",
            "metadata_service_url": "...",
            "order_processing_url": "...",
            "provisioning_service_url": "...",
            "saas_registry_service_url": "..."
          },
          "grant_type": "client_credentials",
          "sap.cloud.service": "com.sap.core.commercial.service.central",
          "uaa": {
            "apiurl": "...",
            "clientid": "...",
            "clientsecret": "...",
            "credential-type": "binding-secret",
            "identityzone": "...",
            "identityzoneid": "...",
            "sburl": "...",
            "subaccountid": "...",
            "tenantid": "...",
            "tenantmode": "shared",
            "uaadomain": "...",
            "url": "...",
            "verificationkey": "...",
            "xsappname": "...",
            "xsmasterappname": "...",
            "zoneid": "..."
          }
        }
---
apiVersion: v1
kind: Secret
metadata:
    namespace: default
    name: sa-provider-secret
type: Opaque
stringData:
    credentials: |
        {
          "email": "<technical-user-email>",
          "username": "<technical-user-username>",
          "password": "<technical-user-password>"
        }
---
apiVersion: btp.sap.crossplane.io/v1alpha1
kind: ProviderConfig
metadata:
    name: account-provider-config
spec:
    globalAccount: <global-account-subdomain>
    cliServerUrl: https://cli.btp.cloud.sap
    cisCredentials:
        secretRef:
            name: cis-provider-secret
            namespace: default
            key: data
        source: Secret
    serviceAccountSecret:
        secretRef:
            key: credentials
            name: sa-provider-secret
            namespace: default
        source: Secret
```

</details>

2. [Create and set up a subaccount](/docs/crossplane-provider-btp/docs/end-user-guides/account/subaccount)

<details>
<summary>`Subaccount`, `ServiceManager`, `Entitlement` and `CloudManagement`</summary>

```yaml
apiVersion: account.btp.sap.crossplane.io/v1alpha1
kind: Subaccount
metadata:
  name: my-subaccount
spec:
  forProvider:
    betaEnabled: true
    description: hello subaccount
    displayName: <display-name> # This value will be displayed as a subaccount name in the BTP cockpit
    region: eu12 # Adjust if needed
    subaccountAdmins:
      - <admin-email> # Use the email address of your technical user
    subdomain: <subaccount-subdomain>  # This value must be unique across all BTP subaccounts
    usedForProduction: "NOT_USED_FOR_PRODUCTION" # Other supported values are "USED_FOR_PRODUCTION" and "UNSET"
  providerConfigRef:
    name: account-provider-config
---
apiVersion: account.btp.sap.crossplane.io/v1beta1
kind: ServiceManager
metadata:
  name: my-subaccount-service-manager
spec:
  writeConnectionSecretToRef:
    name: sap-btp-service-operator
    namespace: default
  forProvider:
    subaccountRef:
      name: my-subaccount
  providerConfigRef:
    name: account-provider-config
---
apiVersion: account.btp.sap.crossplane.io/v1alpha1
kind: Entitlement
metadata:
  name: cis-entitlement
spec:
  forProvider:
    serviceName: cis
    servicePlanName: local
    enable: true
    subaccountRef:
      name: my-subaccount
  providerConfigRef:
    name: account-provider-config
---
apiVersion: account.btp.sap.crossplane.io/v1alpha1
kind: CloudManagement
metadata:
  name: my-subaccount-cis
spec:
  writeConnectionSecretToRef:
    name: cis-local
    namespace: default
  forProvider:
    serviceManagerRef:
      name: my-subaccount-service-manager # Use the ServiceManager resource created in the previous step
    subaccountRef:
      name: my-subaccount
  providerConfigRef:
    name: account-provider-config
```

</details>

### Cloud Foundry

3. [Create a Cloud Foundry environment](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/order-cf-environment#create-cloudfoundryenvironment-)

<details>
<summary>`CloudFoundryEnvironment`</summary>

```yaml
apiVersion: environment.btp.sap.crossplane.io/v1alpha1  
kind: CloudFoundryEnvironment
metadata:
  name: cf-env
spec:
  forProvider:
    initialOrgManagers:
      - technical-user@example.com 
    landscape: cf-eu12
    orgName: test-eu12
    environmentName: cf-test-eu12
  cloudManagementRef:
    name: cis-local
  subaccountRef:
    name: my-subaccount
  writeConnectionSecretToRef:
    name: cf-environment-secret # Secret containing connection details including apiEnpoint of the created cloudfoundry environment. 
    namespace: default
```

</details>

4. [Install](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/configure-provider-cf#install-cloudfoundry-provider) and [configure](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/configure-provider-cf#configure-connection-details) the Cloud Foundry provider

<details>
<summary>`Provider`, `Secret` and `ProviderConfig`</summary>

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: cloudfoundry-provider
spec:
  package: ghcr.io/sap/crossplane-provider-cloudfoundry/crossplane/provider-cloudfoundry:<provider-version>
---
apiVersion: v1
kind: Secret
metadata:
    name: cf-credentials-secret
    namespace: default
type: Opaque
stringData:
    credentials: |
        {
        "email": "<your email>",
        "username": "<technical-user-name>",
        "password": "<technical-user-password>"
        }
---
apiVersion: cloudfoundry.crossplane.io/v1beta1
kind: ProviderConfig
metadata:
    name: default
spec:
    apiEndpoint: https://api.cf.eu12.hana.ondemand.com/
    credentials:
        source: Secret
        secretRef:
            name: cf-credentials-secret
            namespace: default
            key: credentials
```

</details>

5. [Import the organization](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/configure-provider-cf#import-organization-)

<details>
<summary>`Organization`</summary>

```yaml
apiVersion: cloudfoundry.crossplane.io/v1alpha1
kind: Organization
metadata:
  name: my-org
  annotations:
    crossplane.io/external-name: cf-dev ## name of actual CF Org in BTP
spec:
  forProvider: {}
  managementPolicies:
    - Observe
```

</details>

6. [Create a space](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/configure-provider-cf#create-spaces-)

<details>
<summary>`Space`</summary>

```yaml
apiVersion: cloudfoundry.crossplane.io/v1alpha1
kind: Space
metadata:
  name: my-space ## name of custom resource in control plane
spec:
  forProvider:
    allowSsh: true
    name: my-space
    orgRef:
      name:  my-org ## The managed resource name of the Organization in the control plane
```

</details>

7. [Assign](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/configure-provider-cf#manage-user-roles) the `SpaceDeveloper` role to the user you want to deploy the CAP application with later on

<details>
<summary>`SpaceRole`</summary>

```yaml
apiVersion: cloudfoundry.crossplane.io/v1alpha1
kind: SpaceRole
metadata:
  name: space-developer-user1
spec:
  forProvider:
    type: Developer # valid role types are: Developer, Supporter, Auditor, Manager
    username: user1@example.com 
    spaceRef:
      name: my-space
```

</details>

8. [Create an application runtime entitlement](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/deploy-workload-provider-cf#prerequisites-application-runtime-quota)

<details>
<summary>`Entitlement`</summary>

```yaml
apiVersion: account.btp.sap.crossplane.io/v1alpha1 
kind: Entitlement
metadata:
  name: cf-quota
spec:
  forProvider:
    serviceName: APPLICATION_RUNTIME
    servicePlanName: MEMORY
    amount: 2
    subaccountRef:
      name: my-subaccount
```

</details>

### HANA

9. [Create an entitlement for HDI containers](/docs/crossplane-provider-btp/docs/end-user-guides/services/create-services#create-an-entitlement) (`serviceName: hana` and `servicePlanName: hdi-shared`)

<details>
<summary>`Entitlement`</summary>

```yaml
apiVersion: account.btp.sap.crossplane.io/v1alpha1
kind: Entitlement
metadata:
  name: hdi-entitlement
spec:
  forProvider:
    serviceName: hana
    servicePlanName: hdi-shared
    enable: true
    subaccountRef:
      name: my-subaccount
  providerConfigRef:
    name: account-provider-config
```

</details>

10. [Create a SAP HANA Cloud service instance](/docs/crossplane-provider-btp/docs/end-user-guides/services/create-services#service-instance)

<details>
<summary>`Entitlement` and `ServiceInstance`</summary>

```yaml
apiVersion: account.btp.sap.crossplane.io/v1alpha1
kind: Entitlement
metadata:
  name: hana-cloud-entitlement
spec:
  forProvider:
    serviceName: hana-cloud
    servicePlanName: hana
    servicePlanUniqueIdentifier: hana-cloud-hana
    enable: true
    subaccountRef:
      name: my-subaccount
  providerConfigRef:
    name: account-provider-config
---
apiVersion: account.btp.sap.crossplane.io/v1alpha1
kind: ServiceInstance
metadata:
  name: hana-cloud-instance
spec:
  forProvider:
    name: hana-cloud-instance
    serviceManagerRef:
      name: my-subaccount-service-manager
    subaccountRef:
      name: my-subaccount
    offeringName: hana-cloud
    planName: hana
    parameters:
      data:
        memory: 16
        systempassword: Cloud-12345! # TODO change
        edition: cloud
  providerConfigRef:
    name: account-provider-config
```

</details>

11. [Create a service binding for the SAP HANA Cloud service instance](/docs/crossplane-provider-btp/docs/end-user-guides/services/consume-service#create-a-servicebinding)

<details>
<summary>`ServiceBinding`</summary>

```yaml
apiVersion: account.btp.sap.crossplane.io/v1alpha1
kind: ServiceBinding
metadata:
  name: hana-binding
spec:
  forProvider:
    name: hana-binding
    serviceInstanceRef:
      name: hana-cloud-instance
    subaccountRef:
      name: my-subaccount
  writeConnectionSecretToRef:
    name: hana-binding-secret
    namespace: default
  providerConfigRef:
    name: account-provider-config
```

</details>

12. [Install](/docs/crossplane-provider-hana/docs/end-user-guides/setup#install-provider) and [configure](/docs/crossplane-provider-hana/docs/end-user-guides/setup#configure-providerconfig) the HANA provider

<details>
<summary>`Provider`, `Secret` and `ProviderConfig`</summary>

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: hana-provider
spec:
  package: ghcr.io/sap/crossplane-provider-hana/crossplane/provider-hana:<VERSION> # Please use the latest version from the releases page
  packagePullSecrets:
    - name: artifactory-readonly-docker
---
apiVersion: v1
kind: Secret
metadata:
  namespace: default
  name: hana-provider-secret
type: Opaque
data:
  endpoint: abcdefgh-base64-encoded-xyz== # E.g. Base64-encode: my-hana-domain.prod-eu10.hanacloud.ondemand.com
  port: NDQz # E.g. Base64-encode: 443
  username: REJBRE1JTg== # E.g. Base64-encode: DBADMIN 
  password: Q2xvdWQtMTIzNDUh # Same password as set during service instance creation E.g. Base64-encode: Cloud-12345!
---
apiVersion: hana.sap.crossplane.io/v1alpha1
kind: ProviderConfig
metadata:
    name: hana-providerconfig
spec:
  credentials:
    source: Secret
    connectionSecretRef:
      namespace: default
      name: hana-provider-secret
```

</details>

13. [Create a HANA instance mapping (Cloud Foundry)](/docs/crossplane-provider-hana/docs/end-user-guides/instance-mapping#get-access-to-the-admin-api)

<details>
<summary>`Entitlement`, `ServiceInstance`, `ServiceBinding`, `Secret`, `ResourceGraphDefinition`, `CfHanaInstanceMapping`</summary>

```yaml
apiVersion: account.btp.sap.crossplane.io/v1alpha1
kind: Entitlement
metadata:
  name: hana-cloud-api-entitlement
spec:
  forProvider:
    serviceName: hana-cloud
    servicePlanName: admin-api-access
    servicePlanUniqueIdentifier: hana-cloud-admin-api-access
    enable: true
    subaccountRef:
      name: my-subaccount
---
apiVersion: account.btp.sap.crossplane.io/v1alpha1
kind: ServiceInstance
metadata:
  name: hana-api
spec:
  forProvider:
    name: hana-api
    offeringName: hana-cloud
    planName: admin-api-access
    serviceManagerRef:
      name: my-subaccount-service-manager
    subaccountRef:
      name: my-subaccount
    parameters:
      technicalUser: true
---
apiVersion: account.btp.sap.crossplane.io/v1alpha1
kind: ServiceBinding
metadata:
  name: hana-api-binding
spec:
  forProvider:
    name: hana-api-binding
    serviceInstanceRef:
      name: hana-api
    subaccountRef:
      name: my-subaccount
  writeConnectionSecretToRef:
    namespace: default
    name: hana-api-binding-secret
---
apiVersion: v1
kind: Secret
metadata:
  name: hana-api-secret
  namespace: default
type: Opaque
data:
  credentials: '{"baseurl":"{{<baseurl>}}","uaa":{{<uaa>}}}'
---
apiVersion: kro.run/v1alpha1
kind: ResourceGraphDefinition
metadata:
  name: cf-hana-instance-mapping
spec:
  schema:
    apiVersion: v1alpha1
    kind: CfHanaInstanceMapping
    spec:
      serviceInstanceRef: string
      orgRef: string
      spaceRef: string
  resources:
    - id: serviceInstance
      externalRef:
        apiVersion: account.btp.sap.crossplane.io/v1alpha1
        kind: ServiceInstance
        metadata:
          name: ${schema.spec.serviceInstanceRef}
    - id: org
      externalRef:
        apiVersion: cloudfoundry.crossplane.io/v1alpha1
        kind: Organization
        metadata:
          name: ${schema.spec.orgRef}
    - id: space
      externalRef:
        apiVersion: cloudfoundry.crossplane.io/v1alpha1
        kind: Space
        metadata:
          name: ${schema.spec.spaceRef}
    - id: instanceMapping
      template:
        apiVersion: inventory.hana.orchestrate.cloud.sap/v1alpha1
        kind: InstanceMapping
        metadata:
          name: ${schema.metadata.name}
        spec:
          forProvider:
            platform: cloudfoundry
            serviceInstanceID: ${serviceInstance.status.atProvider.id}
            primaryID: ${org.status.atProvider.id}
            secondaryID: ${space.status.atProvider.id}
            adminCredentialsSecretRef:
              name: hana-api-secret
              namespace: default
              key: credentials
---
apiVersion: kro.run/v1alpha1
kind: CfHanaInstanceMapping
metadata:
  name: cf-hana-instance-mapping
spec:
  serviceInstanceRef: my-hana # name of BTP Provider ServiceInstance custom resource
  orgRef: my-org # name of CF Provider Organization custom resource
  spaceRef: my-space # name of CF Provider Space custom resource
```

</details>

### Deployment

14. _Work in progress_, follow ["Deploy to SAP Business Technology Platform, Cloud Foundry"](https://github.com/SAP-samples/cloud-cap-samples-java#deploy-to-sap-business-technology-platform-cloud-foundry) for now

## Result

The CAP application is now successfully deployed in a Cloud Foundry environment on SAP BTP. All underlying infrastructure is managed as data. Changes to this infrastructure can be made by updating the Kubernetes manifests rather than clicking through the SAP BTP cockpit or running manual CLI commands. 🚀

## References

- [Deploy to Cloud Foundry guide in CAP documentation](https://cap.cloud.sap/docs/guides/deploy/to-cf)
- [Deploy to Kyma guide in CAP documentation](https://cap.cloud.sap/docs/guides/deploy/to-kyma)
- [Set Up Schema or HDI Container (Cloud Foundry) in SAP Help Portal](https://help.sap.com/docs/hana-cloud/sap-hana-cloud-getting-started-guide/set-up-schema-or-hdi-container-cloud-foundry?locale=en-US&version=LATEST)

## ⁉ FAQs

No FAQs yet. Got a question? Reach out to us and help us build this section.
