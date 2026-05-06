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

1. [Install](/docs/crossplane-provider-btp/docs/end-user-guides/setup/install-provider-btp#procedure) and [configure](/docs/crossplane-provider-btp/docs/end-user-guides/setup/configure-provider-btp#set-up-the-sap-cloud-management-service) the BTP provider
2. [Create and set up a subaccount](/docs/crossplane-provider-btp/docs/end-user-guides/account/subaccount)
3. [Create a SAP HANA Cloud service instance](/docs/crossplane-provider-btp/docs/end-user-guides/services/create-services#service-instance)
4. [Create a service binding for the SAP HANA Cloud service instance](/docs/crossplane-provider-btp/docs/end-user-guides/services/consume-service#create-a-servicebinding)
5. [Create an entitlement for HDI containers](/docs/crossplane-provider-btp/docs/end-user-guides/services/create-services#create-an-entitlement) (`serviceName: hana` and `servicePlanName: hdi-shared`)
6. [Create an application runtime entitlement](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/deploy-workload-provider-cf#prerequisites-application-runtime-quota)
7. [Create a Cloud Foundry environment](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/order-cf-environment#create-cloudfoundryenvironment-)
8. [Install](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/configure-provider-cf#install-cloudfoundry-provider) and [configure](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/configure-provider-cf#configure-connection-details) the Cloud Foundry provider
9. [Import the organization](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/configure-provider-cf#import-organization-)
10. [Create a space](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/configure-provider-cf#create-spaces-)
11. [Install](/docs/crossplane-provider-hana/docs/end-user-guides/setup#install-provider) and [configure](/docs/crossplane-provider-hana/docs/end-user-guides/setup#configure-providerconfig) the HANA provider
12. [Create a HANA instance mapping (Cloud Foundry)](/docs/crossplane-provider-hana/docs/end-user-guides/instance-mapping#get-access-to-the-admin-api)
13. [Assign](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/configure-provider-cf#manage-user-roles) the "SpaceDeveloper" role to the user you want to deploy the CAP application with
14. Deployment: _Work in progress_, for now follow [this section in cloud-cap-samples-java](https://github.com/SAP-samples/cloud-cap-samples-java#deploy-to-sap-business-technology-platform-cloud-foundry)

## Result

The CAP application is now deployed in a Cloud Foundry environment on SAP BTP and can be accessed via the SAP BTP Cockpit. All underlying infrastructure is managed as data.

## References

- [Deploy to Cloud Foundry guide in CAP documentation](https://cap.cloud.sap/docs/guides/deploy/to-cf)
- [Deploy to Kyma guide in CAP documentation](https://cap.cloud.sap/docs/guides/deploy/to-kyma)
- [Set Up Schema or HDI Container (Cloud Foundry)](https://help.sap.com/docs/hana-cloud/sap-hana-cloud-getting-started-guide/set-up-schema-or-hdi-container-cloud-foundry?locale=en-US&version=LATEST)

## ⁉ FAQs

No FAQs yet. Got a question? Reach out to us and help us build this section.
