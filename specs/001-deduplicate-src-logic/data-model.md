# Data Model: Deduplicate Logic in Src

## Entities

### Code File

- **Fields**: path (string), content (string)
- **Relationships**: contains Duplicate Blocks
- **Validation**: path exists, content not empty

### Duplicate Block

- **Fields**: startLine (number), endLine (number), content (string)
- **Relationships**: belongs to Code File
- **Validation**: lines valid, content matches
