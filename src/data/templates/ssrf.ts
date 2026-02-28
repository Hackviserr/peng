import type { FindingTemplate } from '../../constants';

export const ssrfTemplates: FindingTemplate[] = [
    {
        id: 'ssrf-basic',
        title: 'Server-Side Request Forgery (SSRF)',
        category: 'SSRF',
        severity: 'High',
        cwe: 'CWE-918',
        cvss: '8.6',
        owasp: 'A10:2021 SSRF',
        url: '/api/fetch-url',
        method: 'POST',
        parameter: 'url',
        tags: ['ssrf', 'server-side', 'request-forgery', 'internal-network'],
        description: '<p>The application fetches remote resources based on user-supplied URLs without adequate validation. This allows an attacker to induce the server to make HTTP requests to arbitrary destinations, including internal services, cloud metadata endpoints, and other systems not directly accessible from the internet.</p><p>SSRF is particularly critical in cloud environments where instance metadata services (e.g., <code>http://169.254.169.254</code>) expose IAM credentials, API keys, and other sensitive configuration data. In non-cloud environments, SSRF can be used to scan internal networks, access internal services, and bypass IP-based access controls.</p><p>Testing confirmed that the application processes user-supplied URLs and makes server-side requests to those URLs, including responses from internal network addresses.</p>',
        impact: '<ul><li><strong>Cloud Credential Theft:</strong> Access to cloud metadata endpoints (AWS, GCP, Azure) can expose IAM role credentials, enabling full cloud account compromise.</li><li><strong>Internal Network Access:</strong> The server can be used as a proxy to scan and access internal networks, bypassing firewalls and network segmentation.</li><li><strong>Internal Service Exploitation:</strong> Internal APIs, databases, and management interfaces can be accessed and potentially exploited.</li><li><strong>Data Exfiltration:</strong> Internal documents, configuration files, and other sensitive resources can be retrieved.</li><li><strong>Denial of Service:</strong> The server can be directed to make requests to targets, potentially causing resource exhaustion.</li></ul>',
        remediation: '<ol><li><strong>URL Allowlisting:</strong> Implement a strict allowlist of permitted domains, hostnames, and protocols. Deny all others by default.</li><li><strong>Block Internal Addresses:</strong> Validate resolved IP addresses against blocklists including: private ranges (10.x, 172.16-31.x, 192.168.x), loopback (127.x), link-local (169.254.x), and cloud metadata IPs.</li><li><strong>Disable Unnecessary Protocols:</strong> Only allow <code>http</code> and <code>https</code> schemes. Block <code>file://</code>, <code>ftp://</code>, <code>gopher://</code>, <code>dict://</code>, etc.</li><li><strong>Network Segmentation:</strong> Place the application server in a network segment with no direct access to sensitive internal services.</li><li><strong>IMDSv2:</strong> In AWS, enforce IMDSv2 (token-based) to mitigate SSRF-based metadata access.</li></ol>',
        references: '<p><ul><li><a href="https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/">OWASP Top 10 - A10:2021 SSRF</a></li><li><a href="https://cwe.mitre.org/data/definitions/918.html">CWE-918: Server-Side Request Forgery</a></li><li><a href="https://portswigger.net/web-security/ssrf">PortSwigger - SSRF</a></li></ul></p>',
    },
];
