import type { FindingTemplate } from '../../constants';

export const mobileTemplates: FindingTemplate[] = [
    {
        id: 'mobile-insecure-storage',
        title: 'Insecure Local Data Storage',
        category: 'Mobile',
        severity: 'High',
        cwe: 'CWE-312',
        cvss: '7.5',
        owasp: 'A04:2021 Insecure Design',
        tags: ['mobile', 'storage', 'android', 'ios', 'data-protection'],
        description: '<p>The mobile application stores sensitive data (credentials, tokens, personal information, financial data) in insecure locations on the device without adequate protection. Insecure storage locations include shared preferences (Android) or UserDefaults (iOS) for sensitive data, unencrypted SQLite databases, application logs, clipboard data, and temporary files.</p><p>On rooted/jailbroken devices or through device backup analysis, an attacker can directly access these storage locations and extract sensitive information. Additionally, other malicious applications with storage access permissions may be able to read data from shared or external storage locations.</p><p>Analysis of the application\'s data storage practices revealed sensitive data stored without encryption in accessible device locations.</p>',
        impact: '<ul><li><strong>Credential Theft:</strong> Stored login credentials, API tokens, or session identifiers can be extracted by malware or through physical device access.</li><li><strong>Personal Data Exposure:</strong> PII, financial records, and health data stored without protection are vulnerable to extraction.</li><li><strong>Account Takeover:</strong> Stolen authentication tokens enable unauthorized account access from other devices.</li><li><strong>Backup Exploitation:</strong> Unencrypted data in device backups (iTunes, ADB) can be extracted.</li></ul>',
        remediation: '<ol><li><strong>Use Platform Secure Storage:</strong> Store sensitive data using platform-provided secure storage: Android Keystore/EncryptedSharedPreferences, iOS Keychain.</li><li><strong>Encrypt at Rest:</strong> Encrypt sensitive databases using SQLCipher or platform encryption APIs.</li><li><strong>Minimize Stored Data:</strong> Only store data that is absolutely necessary for offline functionality. Prefer server-side storage with token-based access.</li><li><strong>Disable Backups:</strong> Mark sensitive data as excluded from device backups using <code>android:allowBackup="false"</code> or <code>NSURLIsExcludedFromBackupKey</code>.</li><li><strong>Clear Sensitive Data:</strong> Clear sensitive data from memory, clipboard, and temporary storage when no longer needed or when the app moves to the background.</li></ol>',
        references: '<p><ul><li><a href="https://owasp.org/www-project-mobile-top-10/">OWASP Mobile Top 10</a></li><li><a href="https://cwe.mitre.org/data/definitions/312.html">CWE-312: Cleartext Storage of Sensitive Information</a></li><li><a href="https://mas.owasp.org/MASTG/">OWASP Mobile Application Security Testing Guide (MASTG)</a></li></ul></p>',
    },
    {
        id: 'mobile-cert-pinning-missing',
        title: 'Missing Certificate Pinning',
        category: 'Mobile',
        severity: 'Medium',
        cwe: 'CWE-295',
        cvss: '5.9',
        owasp: 'M3:2024 Insecure Communication',
        affectedHost: 'api.example.com',
        port: '443',
        tags: ['mobile', 'certificate-pinning', 'tls', 'mitm', 'proxy', 'ios'],
        description: '<p>The mobile application does not implement SSL/TLS certificate pinning, accepting any valid certificate signed by a trusted Certificate Authority. This allows an attacker who can install a custom CA certificate on the victim\'s device (corporate MDM, malware, physical access) or who has obtained a fraudulent certificate to intercept and decrypt all HTTPS traffic between the application and its backend servers.</p><p>Without certificate pinning, the application trusts the device\'s certificate store, which can be modified by the user, MDM solutions, or malware with device admin privileges. Certificate pinning restricts which certificates the application will accept, significantly increasing the difficulty of man-in-the-middle attacks.</p>',
        impact: '<ul><li><strong>Traffic Interception:</strong> All API communications can be intercepted and read by an attacker with a custom CA certificate installed on the device.</li><li><strong>Credential Theft:</strong> Login credentials, API tokens, and session cookies intercepted in transit.</li><li><strong>Data Manipulation:</strong> API responses can be modified before reaching the application, potentially injecting malicious content.</li><li><strong>Compliance Issues:</strong> Financial and healthcare applications are often required to implement certificate pinning by industry regulations.</li></ul>',
        remediation: '<ol><li><strong>Implement Certificate Pinning:</strong> Pin the server\'s leaf certificate or public key in the application. Android: Use network security config with <code>&lt;pin-set&gt;</code>. iOS: Use <code>URLSession</code> delegate methods or third-party libraries like TrustKit.</li><li><strong>Pin Backup Keys:</strong> Always include at least one backup pin to prevent lockout during certificate rotation.</li><li><strong>Pin Rotation Plan:</strong> Establish a certificate rotation plan and update pins before current certificates expire.</li><li><strong>Pin at Public Key Level:</strong> Prefer public key pinning (HPKP-style) over certificate pinning, as it survives certificate renewals from the same key pair.</li></ol>',
        references: '<p><ul><li><a href="https://owasp.org/www-project-mobile-top-10/">OWASP Mobile Top 10</a></li><li><a href="https://cwe.mitre.org/data/definitions/295.html">CWE-295: Improper Certificate Validation</a></li><li><a href="https://mas.owasp.org/MASTG/">OWASP MASTG</a></li></ul></p>',
    },
];
