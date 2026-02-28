import type { FindingTemplate } from '../../constants';

export const cloudTemplates: FindingTemplate[] = [
    {
        id: 'cloud-s3-public',
        title: 'Publicly Accessible Cloud Storage Bucket',
        category: 'Cloud',
        severity: 'Critical',
        cwe: 'CWE-284',
        cvss: '9.1',
        owasp: 'A01:2021 Broken Access Control',
        url: 'https://s3.amazonaws.com/company-assets',
        tags: ['cloud', 's3', 'aws', 'bucket', 'public-access', 'storage'],
        description: '<p>A cloud storage bucket (AWS S3, Google Cloud Storage, or Azure Blob Storage) associated with the application is configured with public read and/or write access. This allows anyone on the internet to list, read, and potentially write or delete objects in the bucket without authentication.</p><p>Publicly accessible storage buckets are a leading cause of large-scale data breaches. They frequently contain sensitive data including database backups, application logs, user uploads, configuration files, source code archives, and private documents.</p><p>Testing confirmed that the identified cloud storage bucket allows unauthenticated access to list and/or read objects, exposing potentially sensitive data.</p>',
        impact: '<ul><li><strong>Data Breach:</strong> All data stored in the bucket is accessible to anyone, potentially exposing PII, financial records, health data, and credentials.</li><li><strong>Data Manipulation:</strong> If write access is also public, attackers can modify or delete data, inject malicious content, or deface hosted static websites.</li><li><strong>Supply Chain Attacks:</strong> Writable buckets hosting application assets (JavaScript, CSS) can be modified to inject malicious code served to all users.</li><li><strong>Regulatory Penalties:</strong> Public exposure of personal data triggers mandatory breach notifications and potential fines under GDPR, KVKK, HIPAA, and PCI-DSS.</li></ul>',
        remediation: '<ol><li><strong>Restrict Access Immediately:</strong> Remove all public access configurations. AWS: Enable S3 Block Public Access at the account level. GCP: Set uniform bucket-level access. Azure: Disable anonymous access.</li><li><strong>Audit Permissions:</strong> Review and tighten all bucket policies and ACLs. Apply least-privilege access using IAM policies.</li><li><strong>Enable Logging:</strong> Enable access logging on all storage buckets to monitor and audit data access patterns.</li><li><strong>Encryption:</strong> Enable server-side encryption (SSE) for all stored objects.</li><li><strong>Monitoring:</strong> Use cloud-native tools (AWS Macie, GCP Security Command Center, Azure Defender) to continuously monitor for public bucket misconfigurations.</li></ol>',
        references: '<p><ul><li><a href="https://owasp.org/Top10/A01_2021-Broken_Access_Control/">OWASP Top 10 - A01:2021</a></li><li><a href="https://cwe.mitre.org/data/definitions/284.html">CWE-284: Improper Access Control</a></li><li><a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html">AWS S3 Block Public Access</a></li></ul></p>',
    },
    {
        id: 'cloud-iam-overprivileged',
        title: 'Overprivileged Cloud IAM Role',
        category: 'Cloud',
        severity: 'High',
        cwe: 'CWE-250',
        cvss: '7.5',
        owasp: 'A01:2021 Broken Access Control',
        affectedHost: 'AWS Account',
        tags: ['cloud', 'iam', 'aws', 'permissions', 'least-privilege'],
        description: '<p>A cloud service IAM (Identity and Access Management) role or service account is configured with overly broad permissions that exceed what is required for its intended function. Examples include granting <code>AdministratorAccess</code>, <code>*:*</code> (full access), or broad wildcard permissions to application services that only need access to specific resources.</p><p>Overprivileged roles amplify the impact of any security compromise. If an application or service using an overprivileged role is compromised, the attacker inherits all of the role\'s excessive permissions, potentially gaining access to the entire cloud environment.</p><p>Analysis of the cloud IAM configuration revealed roles with permissions significantly exceeding the principle of least privilege.</p>',
        impact: '<ul><li><strong>Blast Radius Amplification:</strong> A compromised service with broad permissions gives attackers access to resources far beyond the application\'s scope.</li><li><strong>Lateral Movement:</strong> Overprivileged roles enable attackers to pivot to other services, accounts, and data stores within the cloud environment.</li><li><strong>Data Exfiltration:</strong> Broad data access permissions allow extraction of sensitive data across multiple services.</li><li><strong>Infrastructure Compromise:</strong> Administrative permissions enable attackers to create resources, modify configurations, and establish persistent access across the cloud account.</li></ul>',
        remediation: '<ol><li><strong>Principle of Least Privilege:</strong> Restrict each IAM role to only the specific permissions, resources, and actions required for its function.</li><li><strong>Permission Boundaries:</strong> Use IAM permission boundaries to set maximum possible permissions regardless of policy grants.</li><li><strong>Access Analyzer:</strong> Use cloud-native access analysis tools (AWS IAM Access Analyzer, GCP IAM Recommender) to identify and reduce unused permissions.</li><li><strong>Regular Audits:</strong> Conduct quarterly IAM permission audits to identify and remove unnecessary access grants.</li><li><strong>Service-Specific Roles:</strong> Create dedicated IAM roles for each service or application, rather than sharing roles across multiple services.</li></ol>',
        references: '<p><ul><li><a href="https://owasp.org/Top10/A01_2021-Broken_Access_Control/">OWASP Top 10 - A01:2021</a></li><li><a href="https://cwe.mitre.org/data/definitions/250.html">CWE-250: Execution with Unnecessary Privileges</a></li></ul></p>',
    },
];
