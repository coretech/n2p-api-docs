# net2phone Developer Portal

The net2phone Developer Portal was developed with the intent to provide consistent and updated documentation to support discovery and development on the legacy, current and future APIs and Webhooks. Additionally, it will be the repository of “all things integrations”. A one stop shop for those looking to utilize current native integrations as well as for those Partners and Developers looking for documentation regarding our APIs and Webhooks for the purpose of creating new integrations to drive our “communications as an experience” philosophy.

### Who Is It For?

The net2phone Developer Portal is developed for both internal and external developers as a resource for development and integration between net2phone and any internal or external application or system with the purpose of creating a more efficient and client focused communications experience.

It is for the developer, it is for the Stakeholder, it is to empower creative communications experiences for those that want more than a phone system.

### How it Can Be Used

The Portal will continuously grow and change as integrations, APIs and Webhooks become available and are developed upon. This is the strength of having a single repository for these resources. The Portal can and should be used as the single source of information for all publicly available technical resources provided by net2phone. In the future all internal resources will also be made available for internal use as well \* apis, design systems, change logs, etc.

### How it works

The developer portal uses spec files written in “open api specification (OAS)” formerly known as Swagger that are available as a public repository for both the APIv1 and Webhook documentation. This standard allows the portal to display the specifications is a rich and interactive way to show users what the data model they can expect to receive looks like as well as examples.

For the documentation and blog entries the markdown format is utilized to provide as simple as it gets text editing and then it is formatted nicely and presented to the end users.

All documentation is open and public, on top of that standard net2phone authentication is used to provide for better user experience, and in the future to provide a way for users to make real api calls directly from the Portal (similar to Postman) using the OAS specification and OAuth2.0 the same as the end user would use in their applications.

### What have we done so far

We’ve created specs for publicly available webhooks consolidating Confluence pages, google docs, developer knowledge, and real word data to create the single source of truth that is continuously updated. The APIv1 specs were created from an even more complex mess of sources to contain only the endpoints that are available to all end users regardless of provider (4psa, versature, unite, and 3.0).

The portal has been built with versioning in mind and whenever APIv2 is available for the public the documentation will already be available in the Portal with users being automatically directed to the correct version for them.

We’ve had a good start with a few markdown documents but learned that the current tooling is not great for SEO or real world performance which also affects SEO and user experience so we are working to overhaul the underlying architecture the Portal uses to make it lightning fast and make the Portal a marketing funnel as well.

### What is currently available:

- API v1 (formerly known as Integrate API) documentation
- Unite Webhooks documentation
- Zapier Documentation and Examples

### What is continuously updated:

- Unite Webhooks documentation

### Coming Soon:

#### APIs & Webhooks:

- New Unite v2 API documentation (code name i2)

#### Integrations:

- Chrome Extension Documentation
  - Screen Pop Modal Examples and Instructions
- Zoho Integration Documentation
- Microsoft Teams Integration Documentation
- Slack Integration Documentation
- Salesforce Integration Documentation
- Purple Cloud Integration Documentation
- Future Integration Documentation

#### Blog:

- Searchable content
- Relevant information regarding n2p integrations
- Thought leadership
- Blog releases about new integrations

### Support & Product Owners

**Product Owner:** Shimon Detwiler  
**Developer Contact:** Avi Charlop [github](https://github.com/acharlop)  
**Email contact:** [integrations@net2phone.com](mailto:integrations@net2phone.com)

**Updated:** July 8th, 2021