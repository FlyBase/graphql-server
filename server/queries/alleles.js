import gql from 'graphql-tag'

export default gql`
query getClassicalAndInsertionAlleles($fbid: String!, $isConstruct: Boolean = false) {
  allGenes(condition: {uniquename: $fbid}) {
    nodes {
      name
      uniquename
      # insertionsByGeneId @skip(if: $isConstruct) {
      #   nodes {
      #     fbtiId
      #     symbol
      #     constructsByInsertionId {
      #       nodes {
      #         fbtpId
      #         symbol
      #         toolUsesByConstructId {
      #           nodes {
      #             ...toolUses
      #           }
      #         }
      #         toolsByConstructId {
      #           nodes {
      #             ...toolFields
      #           }
      #         }
      #       }
      #     }
      #   }
      # }
      allelesByGeneId(condition: {isConstruct: $isConstruct}) {
        nodes {
          symbol
          fbalId
          #isConstruct
          #propagateTransgenicUses
          #alleleClassesByAlleleId {
          #  nodes {
          #    fbcvId
          #    name
          #  }
          #}
          #insertionsByAlleleId {
          #  nodes {
          #    fbtiId
          #    symbol
          #    constructsByInsertionId {
          #      nodes {
          #        fbtpId
          #        symbol
          #        toolUsesByConstructId {
          #          nodes {
          #            ...toolUses
          #          }
          #        }
          #        toolsByConstructId {
          #          nodes {
          #            ...toolFields
          #          }
          #        }
          #      }
          #    }
          #  }
          #}
          #constructsByAlleleId {
          #  nodes {
          #    fbtpId
          #    symbol
          #    toolsByConstructId {
          #      nodes {
          #        ...toolFields
          #      }
          #    }
          #    toolUsesByConstructId {
          #      nodes {
          #        ...toolUses
          #      }
          #    }
          #  }
          #}
          #toolsByAlleleId {
          #  nodes {
          #    ...toolFields
          #  }
          #}
          #toolUsesByAlleleId {
          #  nodes {
          #    ...toolUses
          #  }
          #}
        }
      }
    }
  }
}

#fragment toolFields on Tool {
#  fbtoId
#  symbol
#  relType
#  toolUsesByToolId {
#    nodes {
#      ...toolUses
#    }
#  }
#
#}
#
#fragment toolUses on ToolUse {
#  fbcvId
#  name
#}
`
