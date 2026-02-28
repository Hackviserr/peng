import type { FindingTemplate } from '../../constants';

export const cryptoTemplates: FindingTemplate[] = [
    {
        id: 'crypto-weak-hashing',
        title: 'Weak Password Hashing Algorithm',
        category: 'Cryptographic Failures',
        severity: 'High',
        cwe: 'CWE-916',
        cvss: '7.5',
        owasp: 'A02:2021 Cryptographic Failures',
        tags: ['cryptography', 'hashing', 'password', 'md5', 'sha1', 'bcrypt'],
        description: '<p>The application uses a weak or inappropriate hashing algorithm (such as MD5, SHA-1, or unsalted SHA-256) for storing user passwords. These algorithms are designed for speed, which makes them vulnerable to brute force and dictionary attacks using GPUs or specialized hardware.</p><p>Modern GPU-based password cracking tools (Hashcat, John the Ripper) can compute billions of MD5 or SHA-1 hashes per second, allowing an attacker who obtains the password database to quickly recover plaintext passwords. Even with salting, fast hash algorithms offer inadequate protection against determined attackers.</p><p>Analysis of the application\'s authentication system revealed the use of a cryptographically inappropriate hashing algorithm for password storage.</p>',
        impact: '<ul><li><strong>Mass Password Recovery:</strong> If the password database is compromised, weak hashing allows rapid recovery of plaintext passwords.</li><li><strong>Credential Stuffing:</strong> Recovered passwords can be used to attack users\' accounts on other services where they may reuse passwords.</li><li><strong>Regulatory Non-Compliance:</strong> GDPR, PCI-DSS, and KVKK require adequate cryptographic protection of personal and authentication data.</li></ul>',
        remediation: '<ol><li><strong>Use Purpose-Built Algorithms:</strong> Migrate to password hashing algorithms specifically designed for password storage: <strong>Argon2id</strong> (recommended by OWASP), <strong>bcrypt</strong>, or <strong>scrypt</strong>.</li><li><strong>Configure Work Factors:</strong> Set appropriate cost parameters: bcrypt work factor ≥ 12, Argon2id with memory ≥ 19 MiB, iterations ≥ 2.</li><li><strong>Transparent Migration:</strong> Implement transparent rehashing by verifying existing hashes on login and upgrading to the new algorithm upon successful authentication.</li><li><strong>Unique Salts:</strong> Ensure each password is hashed with a unique, cryptographically random salt (handled automatically by bcrypt and Argon2).</li></ol>',
        references: '<p><ul><li><a href="https://owasp.org/Top10/A02_2021-Cryptographic_Failures/">OWASP Top 10 - A02:2021</a></li><li><a href="https://cwe.mitre.org/data/definitions/916.html">CWE-916: Use of Password Hash With Insufficient Computational Effort</a></li><li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html">OWASP Password Storage Cheat Sheet</a></li></ul></p>',
    },
    {
        id: 'crypto-cleartext-transmission',
        title: 'Sensitive Data Transmitted in Cleartext',
        category: 'Cryptographic Failures',
        severity: 'High',
        cwe: 'CWE-319',
        cvss: '7.5',
        owasp: 'A02:2021 Cryptographic Failures',
        url: 'http://app.example.com/api/login',
        method: 'POST',
        tags: ['cleartext', 'http', 'encryption', 'transmission', 'credentials'],
        description: '<p>The application transmits sensitive data (credentials, personal information, financial data, API tokens) over unencrypted HTTP connections. Any network-positioned attacker (on shared WiFi, compromised router, ISP, or backbone) can intercept and read the transmitted data using passive network monitoring tools such as Wireshark or tcpdump.</p><p>This vulnerability is particularly severe when authentication credentials are transmitted in cleartext, as it enables direct account compromise. It also affects API communications, internal service calls, and any data transfer that should be confidential.</p>',
        impact: '<ul><li><strong>Credential Theft:</strong> Usernames and passwords intercepted in transit enable immediate account takeover.</li><li><strong>Session Hijacking:</strong> Unencrypted session tokens can be captured and reused by attackers.</li><li><strong>Data Breach:</strong> Personal, financial, and medical data transmitted without encryption is exposed to network-level attackers.</li><li><strong>Compliance Violations:</strong> PCI-DSS, HIPAA, GDPR, and KVKK all require encryption of sensitive data in transit.</li></ul>',
        remediation: '<ol><li><strong>Enforce HTTPS Everywhere:</strong> Configure all web servers and applications to use TLS encryption (HTTPS) for all communications, not just login pages.</li><li><strong>Redirect HTTP to HTTPS:</strong> Implement automatic 301 redirects from HTTP to HTTPS on all endpoints.</li><li><strong>Enable HSTS:</strong> Add the <code>Strict-Transport-Security</code> header to prevent downgrade attacks.</li><li><strong>Secure API Communications:</strong> Ensure all API endpoints (internal and external) require TLS with certificate verification.</li><li><strong>Secure Cookie Flags:</strong> Set the <code>Secure</code> flag on all cookies to prevent transmission over HTTP.</li></ol>',
        references: '<p><ul><li><a href="https://owasp.org/Top10/A02_2021-Cryptographic_Failures/">OWASP Top 10 - A02:2021</a></li><li><a href="https://cwe.mitre.org/data/definitions/319.html">CWE-319: Cleartext Transmission of Sensitive Information</a></li></ul></p>',
    },
];
