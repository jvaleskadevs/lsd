import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const API_URL = 'https://api-mumbai.lens.dev'
//const API_URL = 'https://api.lens.dev'

/* create the API client */
export const client = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache()
})

export const getProfiles = gql`
query profiles(
  $addresses: [EthereumAddress!]
) {
  profiles(request: {
    ownedBy: $addresses
  }) {
    items {
      id
      handle
    }
  }
}
`

export const getProfilesByHandle = gql`
query profiles(
  $handles: [Handle!]
) {
  profiles(request: {
    handles: $handles
  }) {
    items {
      id
      ownedBy
    }
  }
}
`

export const getFollowers = gql`
query Followers($profileId: ProfileId!) {
  followers(request: { 
        profileId: $profileId,
        limit: 20
      }) {
       items {
      wallet {
        address
        defaultProfile {
          id
          name
          bio
          handle
          picture {
            ... on NftImage {
              contractAddress
              tokenId
              uri
              verified
            }
            ... on MediaSet {
              original {
                url
                mimeType
              }
            }
          }
        }
      }
    }
  }
}
`

export const getPublications = gql`
query Publications($profileId: ProfileId!) {
  publications(request: {
    profileId: $profileId
    publicationTypes: [POST, COMMENT, MIRROR],
    limit: 5
  }) {
    items {
      __typename
        ... on Post {
          id
          profile {
            id
            name
            handle
            picture {
              ... on NftImage {
                contractAddress
                tokenId
                uri
                verified
              }
              ... on MediaSet {
                original {
                  url
                  mimeType
                }
              }
            }
          }
          metadata {
            tags
            content
          }
          createdAt
        }
        ... on Comment {
          id
          profile {
            id
            name
            handle
            picture {
              ... on NftImage {
                contractAddress
                tokenId
                uri
                verified
              }
              ... on MediaSet {
                original {
                  url
                  mimeType
                }
              }
            }
          }
          metadata {
            tags
            content
          }
          createdAt
        }
        ... on Mirror {
          id
          profile {
            id
            name
            handle
            picture {
              ... on NftImage {
                contractAddress
                tokenId
                uri
                verified
              }
              ... on MediaSet {
                original {
                  url
                  mimeType
                }
              }
            }
          }
          metadata {
            tags
            content
          }
          createdAt
        }
    }
    pageInfo {
      prev
      next
      totalCount
    }
  }
}
`
