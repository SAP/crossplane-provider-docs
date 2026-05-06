---
sidebar_position: 0
---

# Guide

## Introduction

This guide walks through deploying the [cloud-cap-samples-java](https://github.com/SAP-samples/cloud-cap-samples-java) to a Cloud Foundry environment on SAP Business Technology Platform (BTP) — using Infrastructure as Data.

> "The _Cloud Application Programming Model_ (CAP) is a framework of languages, libraries, and tools for building enterprise-grade cloud applications." - https://cap.cloud.sap/docs/get-started/features#what-is-cap

Rather than repeating what the individual Crossplane provider docs already cover, it links to the relevant sections and adds additional context where needed.

:::info
cloud-cap-samples-java can also be [deployed to a Kyma runtime on SAP BTP](https://github.com/SAP-samples/cloud-cap-samples-java#deploy-to-sap-business-technology-platform-kyma-runtime). This is not yet covered in this guide. Please don't hesitate to [contribute](/docs/contribution/solve-tickets#shared-documentation)!
:::

## 🚧 Prerequisites

- You have a running control plane.
- You have cloned [cloud-cap-samples-java](https://github.com/SAP-samples/cloud-cap-samples-java) to your local machine.

## Procedure

1. [Install](/docs/crossplane-provider-btp/docs/end-user-guides/setup/install-provider-btp) and [configure](/docs/crossplane-provider-btp/docs/end-user-guides/setup/configure-provider-btp) the BTP provider
2. [Create and set up a subaccount](/docs/crossplane-provider-btp/docs/end-user-guides/account/subaccount)
3. [Enable XSUAA on subaccount level](/docs/crossplane-provider-btp/docs/end-user-guides/account/usermanagement?type=subaccount#enable-xsuaa)
4. [Create a SAP HANA Cloud service instance and SAP HANA Cloud Administration Tools subscription](/docs/crossplane-provider-btp/docs/end-user-guides/services/create-services)
5. [Assign yourself](/docs/crossplane-provider-btp/docs/end-user-guides/account/usermanagement#assign-users-to-role-collections) the "SAP HANA Cloud Viewer" or "SAP HANA Cloud Administrator" role collection (required to verify the creation of the HANA instance mapping later on)
6. [Create an entitlement for HDI containers](/docs/crossplane-provider-btp/docs/end-user-guides/services/create-services#create-an-entitlement) (`serviceName: hana` with `servicePlanName: hdi-shared`)
7. [Create a Cloud Foundry environment](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/order-cf-environment)
8. [Create a ServiceBinding for the SAP HANA Cloud service instance](/docs/crossplane-provider-btp/docs/end-user-guides/services/consume-service) (we don't create a database schema but an instance mapping later)
9. [Create application runtime entitlement](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/deploy-workload-provider-cf#prerequisites-application-runtime-quota)
10. [Install and configure the HANA provider](/docs/crossplane-provider-hana/docs/end-user-guides/setup#install-provider)
11. [Create a HANA instance mapping](/docs/crossplane-provider-hana/docs/end-user-guides/instance-mapping#get-access-to-the-admin-api)
12. [Install](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/configure-provider-cf#install-cloudfoundry-provider) and [configure](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/configure-provider-cf#configure-connection-details) the Cloud Foundry provider
13. [Import the organization](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/configure-provider-cf#import-organization-)
14. [Create a space](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/configure-provider-cf#create-spaces-)
15. [Assign org and space roles](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/configure-provider-cf#manage-user-roles) (especially the `SpaceDeveloper` role for the user deploying the CAP application later on)
16. Deployment: _Work in progress_, for now follow [cloud-cap-samples-java](https://github.com/SAP-samples/cloud-cap-samples-java#deploy-to-sap-business-technology-platform-cloud-foundry)

## Result

Your CAP application is now fully deployed in a Cloud Foundry environment on SAP BTP and you can access it via the SAP BTP Cockpit. All underlying infrastructure is managed as data.

## References

- [SAP Cloud Application Programming Model (CAP) documentation](https://cap.cloud.sap/)
- [CAP Deploy to Cloud Foundry](https://cap.cloud.sap/docs/guides/deploy/to-cf)
- [CAP Deploy to Kyma](https://cap.cloud.sap/docs/guides/deploy/to-kyma)
- [Set Up a Schema or an HDI Container (Cloud Foundry)](https://help.sap.com/docs/hana-cloud/sap-hana-cloud-getting-started-guide/set-up-schema-or-hdi-container-cloud-foundry)

## ⁉ FAQs

No FAQs yet. Got a question? Reach out to us and help us build this section.
