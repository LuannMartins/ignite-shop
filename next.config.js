/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['files.stripe.com']
  }
}

module.exports = {
  images: {
    loader: 'default' // ou substitua por outro serviço de otimização de imagem, como 'imgix'
  }
}

module.exports = nextConfig
