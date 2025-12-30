---
id: message-processor
title: Message Processor
---

## Details
<div className="table-container">
| Field               | Value                    |
|---------------------|--------------------------|
| **Unique ID**       | message-processor                   |
| **Node Type**       | service             |
| **Name**            | Message Processor                 |
| **Description**     | Core service that processes notification messages, validates content, and routes to appropriate delivery channels          |

</div>

## Interfaces
    _No interfaces defined._


## Related Nodes
```mermaid
graph TD;
message-processor[message-processor]:::highlight;
api-endpoint -- Connects --> message-processor;
message-processor -- Connects --> message-store;
message-processor -- Connects --> kafka-event-bus;
classDef highlight fill:#f2bbae;

```
## Controls

        ### Field Level Encryption

        Application-level encryption for PII fields before storage

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
                                <a href="https://internal-policy.acme.com/security/field-encryption" target="_blank">
                                    https://internal-policy.acme.com/security/field-encryption
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
                                            <td>algorithm</td>
                                            <td>AES-256-GCM</td>
                                        </tr>
                                        <tr>
                                            <td>keyDerivation</td>
                                            <td>PBKDF2-SHA256</td>
                                        </tr>
                                        <tr>
                                            <td>iterations</td>
                                            <td>10000</td>
                                        </tr>
                                        <tr>
                                            <td>encryptedFields</td>
                                            <td>[object Object]</td>
                                        </tr>
                                        <tr>
                                            <td>keyRotationPolicy</td>
                                            <td>90-days</td>
                                        </tr>
                                        <tr>
                                            <td>keyWrapping</td>
                                            <td>envelope-encryption</td>
                                        </tr>
                                    </tbody>
                                </table>

                        </td>
                    </tr>
                </tbody>
            </table>
        </div>


        ### Pii Tokenization

        Replace PII with tokens for non-sensitive operations

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
                                <a href="https://internal-policy.acme.com/security/tokenization" target="_blank">
                                    https://internal-policy.acme.com/security/tokenization
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
                                            <td>provider</td>
                                            <td>HashiCorp Vault</td>
                                        </tr>
                                        <tr>
                                            <td>tokenFormat</td>
                                            <td>format-preserving</td>
                                        </tr>
                                        <tr>
                                            <td>fields</td>
                                            <td>recipient_email,recipient_phone</td>
                                        </tr>
                                        <tr>
                                            <td>detokenization</td>
                                            <td>[object Object]</td>
                                        </tr>
                                        <tr>
                                            <td>tokenTTL</td>
                                            <td>24h</td>
                                        </tr>
                                    </tbody>
                                </table>

                        </td>
                    </tr>
                </tbody>
            </table>
        </div>


## Metadata
  <div className="table-container">
      <table>
          <thead>
          <tr>
              <th>Key</th>
              <th>Value</th>
          </tr>
          </thead>
          <tbody>
          <tr>
              <td>
                  <b>Repository</b>
              </td>
              <td>
                  https://github.com/acme/message-processor-service
                      </td>
          </tr>
          <tr>
              <td>
                  <b>OncallChannel</b>
              </td>
              <td>
                  #notifications-oncall
                      </td>
          </tr>
          <tr>
              <td>
                  <b>DeploymentType</b>
              </td>
              <td>
                  container
                      </td>
          </tr>
          <tr>
              <td>
                  <b>Platform</b>
              </td>
              <td>
                  Kubernetes
                      </td>
          </tr>
          <tr>
              <td>
                  <b>Scaling</b>
              </td>
              <td>
                  <div className="table-container">
                      <table>
                          <thead>
                          <tr>
                              <th>Key</th>
                              <th>Value</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr>
                              <td>
                                  <b>Type</b>
                              </td>
                              <td>
                                  horizontal
                                      </td>
                          </tr>
                          <tr>
                              <td>
                                  <b>MinReplicas</b>
                              </td>
                              <td>
                                  5
                                      </td>
                          </tr>
                          <tr>
                              <td>
                                  <b>MaxReplicas</b>
                              </td>
                              <td>
                                  30
                                      </td>
                          </tr>
                          <tr>
                              <td>
                                  <b>TargetCPU</b>
                              </td>
                              <td>
                                  65%
                                      </td>
                          </tr>
                          <tr>
                              <td>
                                  <b>TargetMemory</b>
                              </td>
                              <td>
                                  75%
                                      </td>
                          </tr>
                          </tbody>
                      </table>
                  </div>
              </td>
          </tr>
          <tr>
              <td>
                  <b>HealthCheck</b>
              </td>
              <td>
                  <div className="table-container">
                      <table>
                          <thead>
                          <tr>
                              <th>Key</th>
                              <th>Value</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr>
                              <td>
                                  <b>Endpoint</b>
                              </td>
                              <td>
                                  /actuator/health
                                      </td>
                          </tr>
                          <tr>
                              <td>
                                  <b>Port</b>
                              </td>
                              <td>
                                  8080
                                      </td>
                          </tr>
                          <tr>
                              <td>
                                  <b>Protocol</b>
                              </td>
                              <td>
                                  HTTP
                                      </td>
                          </tr>
                          </tbody>
                      </table>
                  </div>
              </td>
          </tr>
          </tbody>
      </table>
  </div>
