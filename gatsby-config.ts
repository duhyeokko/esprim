import { siteMetadata } from './config/site-metadata'
import { GatsbyConfig } from 'gatsby'

const config: GatsbyConfig = {
  siteMetadata,
  plugins: ['gatsby-plugin-typescript', 'gatsby-plugin-tsconfig-paths'],
}

export default config
