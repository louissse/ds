# Publication model

Each row in `publications` represents one OpenAlex publication. The import maps the API response to a smaller application object, then stores it as follows:

| Application field         | SQLite column      | Content                                          |
| ------------------------- | ------------------ | ------------------------------------------------ |
| `id`                      | `id`               | OpenAlex ID; primary key used for upsert         |
| `title`                   | `title`            | Publication title                                |
| `publicationDate`         | `publication_date` | Date as `YYYY-MM-DD` text                        |
| `citationCount`           | `citation_count`   | Integer citation count                           |
| `doi`                     | `doi`              | DOI URL, or `null`                               |
| `landingPageUrl`          | `landing_page_url` | Publication page URL, or `null`                  |
| `abstract`                | `abstract`         | Reconstructed abstract text, or `null`           |
| `openAccess.isOpenAccess` | `is_open_access`   | Boolean stored as integer `0` or `1`             |
| `openAccess.status`       | `oa_status`        | OpenAlex open access status                      |
| `openAccess.url`          | `oa_url`           | Open access URL, or `null`                       |
| `authorships`             | `authorships_json` | Ordered author affiliations, stored as JSON text |
| `topics`                  | `topics_json`      | Topic IDs and names, stored as JSON text         |

The nested fields have this shape (illustrative values):

```json
{
  "authorships": [
    {
      "authorId": "https://openalex.org/A123",
      "authorName": "Example Author",
      "authorPosition": "first",
      "institutions": [
        {
          "id": "https://openalex.org/I123",
          "name": "Example University",
          "countryCode": "DK"
        }
      ]
    }
  ],
  "topics": [
    {
      "id": "https://openalex.org/T123",
      "name": "Example topic"
    }
  ]
}
```

An author ID or institution country code may be `null`, and the lists may be empty. Each author can have multiple institutions. Countries describe institutional affiliations, not author nationality. `authorPosition` is `first`, `middle` or `last`; the array order is also preserved because multiple authors can be `middle`.

The results list can use title, date, authors, institutions and topics. The detail view additionally uses the abstract, full author affiliations, citation count, links and open access information. A combined institution list is derived from the authorships and deduplicated by institution ID, rather than stored a second time.
