import { siteMetadata } from './config/site-metadata'
import { GatsbyConfig } from 'gatsby'

const config: GatsbyConfig = {
  siteMetadata,
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/data/mdx/`,
      },
    },
    {
      resolve: `gatsby-plugin-page-creator`,
      options: {
        path: `${__dirname}/src/data/mdx`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              exclude: 'Table of Contents',
              tight: false,
              ordered: false,
              fromHeading: 1,
              toHeading: 6,
              className: 'table-of-contents',
            },
          },
        ],
      },
    },
    `gatsby-plugin-theme-ui`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-tsconfig-paths`,
  ],
}

export default config
