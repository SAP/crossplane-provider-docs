---
sidebar_position: 0
---

# Guide

## Introduction

This guide covers how to deploy a SAP CAP application with a SAP HANA Cloud database to a Cloud Foundry environment on SAP BTP — using Infrastructure as Data.

> "The _Cloud Application Programming Model_ (CAP) is a framework of languages, libraries, and tools for building enterprise-grade cloud applications." - https://cap.cloud.sap/docs/get-started/features#what-is-cap

Rather than repeating what the individual Crossplane provider docs already cover, it links to the relevant sections and adds additional context where needed.

:::info

A SAP CAP application can also be [deployed to a SAP BTP Kyma Runtime](https://cap.cloud.sap/docs/guides/deploy/to-kyma). This is not yet covered in this guide. Please don't hesitate to [contribute](/docs/contribution/solve-tickets#shared-documentation)!

:::

## 🚧 Prerequisites

- You have a running control plane.

## Procedure

### BTP provider

1. [Install](/docs/crossplane-provider-btp/docs/end-user-guides/setup/install-provider-btp) and [configure](/docs/crossplane-provider-btp/docs/end-user-guides/setup/configure-provider-btp) the BTP provider
2. [Create and set up a subaccount](/docs/crossplane-provider-btp/docs/end-user-guides/account/subaccount)
3. [Enable XSUAA on subaccount level](/docs/crossplane-provider-btp/docs/end-user-guides/account/usermanagement?type=subaccount#enable-xsuaa)
4. [Create a SAP HANA Cloud service instance and SAP HANA Cloud Administration Tools subscription](/docs/crossplane-provider-btp/docs/end-user-guides/services/create-services)
5. [Assign users or user groups to the role collections](/docs/crossplane-provider-btp/docs/end-user-guides/account/usermanagement#assign-users-and-user-groups-to-role-collections-) provided by SAP HANA Cloud Administration Tools
6. [Create an entitlement for HDI containers](/docs/crossplane-provider-btp/docs/end-user-guides/services/create-services#create-an-entitlement) (`serviceName: hana` with `servicePlanName: hdi-shared`)
7. [Create a Cloud Foundry environment](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/order-cf-environment)
8. [Create a ServiceBinding for the SAP HANA Cloud service instance](/docs/crossplane-provider-btp/docs/end-user-guides/services/consume-service) (we don't create a database schema but a HANA CF instance mapping later)
9. [Create application runtime entitlement](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/deploy-workload-provider-cf#prerequisites-application-runtime-quota)
10. [Create a subscription](/docs/crossplane-provider-btp/docs/end-user-guides/services/create-services#create-a-subscription) to your CAP application (`planName: ""`)

### HANA provider

1. [Install and configure the HANA provider](/docs/crossplane-provider-hana/docs/end-user-guides/setup#install-provider)
2. [Create a HANA Cloud Foundry instance mapping](TODO)

### Cloud Foundry provider

1. [Install](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/configure-provider-cf#install-cloudfoundry-provider) and [configure](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/configure-provider-cf#configure-connection-details) the Cloud Foundry provider
2. [Import the organization](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/configure-provider-cf#import-organization-)
3. [Create a space](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/configure-provider-cf#create-spaces-)
4. [Assign org and space roles](/docs/crossplane-provider-cloudfoundry/docs/end-user-guides/configure-provider-cf#manage-user-roles) (especially the `SpaceDeveloper` role for the user deploying the CAP application later on)
5. Deployment: _Work in progress_

## References

- [SAP Cloud Application Programming Model (CAP) documentation](https://cap.cloud.sap/)
- [Set Up a Schema or an HDI Container (Cloud Foundry)](https://help.sap.com/docs/hana-cloud/sap-hana-cloud-getting-started-guide/set-up-schema-or-hdi-container-cloud-foundry)

## ⁉ FAQs

No FAQs yet. Got a question? Reach out to us and help us build this section.
