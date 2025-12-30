---
id: processor-to-message-store
title: Processor To Message Store
---

## Details
<div className="table-container">
| Field               | Value                    |
|---------------------|--------------------------|
| **Unique ID**       | processor-to-message-store                   |
| **Description**      |  Message Processor persists notification records, delivery status, and audit trail to Message Store   |
</div>

## Related Nodes
```mermaid
graph TD;
message-processor -- Connects --> message-store;

```

## Controls

        ### Encryption In Transit

        PostgreSQL connection encryption requirements

        <div className="table-container">
            <table>
                <thead>
                <tr>
                    <th>Requirement URL</th>
                    <th>Config</th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                                <a href="https://internal-policy.acme.com/security/jdbc-ssl" target="_blank">
                                    https://internal-policy.acme.com/security/jdbc-ssl
                                </a>
                        </td>

                        <td>
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Key</th>
                                        <th>Value</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>sslMode</td>
                                            <td>verify-full</td>
                                        </tr>
                                        <tr>
                                            <td>sslFactory</td>
                                            <td>org.postgresql.ssl.DefaultJavaSSLFactory</td>
                                        </tr>
                                        <tr>
                                            <td>connectionTimeout</td>
                                            <td>5000</td>
                                        </tr>
                                        <tr>
                                            <td>sslRootCert</td>
                                            <td>/etc/ssl/certs/rds-ca-2024-bundle.pem</td>
                                        </tr>
                                    </tbody>
                                </table>

                        </td>
                    </tr>
                </tbody>
            </table>
        </div>


## Metadata
  _No Metadata defined._
