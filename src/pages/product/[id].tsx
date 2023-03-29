import { stripe } from "@/lib/stripe";
import { ImageContainer, ProductContainer, ProductDetails } from "@/styles/pages/product";
import { GetStaticPaths, GetStaticProps } from "next";
import Stripe from "stripe";
import Image from 'next/image'
import axios from "axios";
import { useState } from "react";
import Head from "next/head";

interface ProductProps {
  product: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
    description: string | null; // alteração feita aqui
    defaultPriceId: string,
  }
}

export default function Product({ product }: ProductProps) {
  const [isCreatingCheckoutSessions, setIsCreatingCheckoutSessions] = useState(false)
  
  async function handleBuyProduct() {
    try {
      setIsCreatingCheckoutSessions(true);

      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId,
      })

      const { checkoutUrl } = response.data;

      window.location.href = checkoutUrl
    } catch (err) {

      setIsCreatingCheckoutSessions(false);
      alert('Falha ao redirecionar ao checkout!');
    }
  }

  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>
      
    <ProductContainer>
      <ImageContainer>
        {product && (
          <>
            <Image src={product?.imageUrl} width={520} height={480} alt="" />
          </>
          )}
      </ImageContainer>

      <ProductDetails>
        {product && (
          <>
            <h1>{product.name}</h1>
            <span>{product.price}</span>
            <p>{product?.description}</p>

            <button disabled={isCreatingCheckoutSessions} onClick={handleBuyProduct}>
              Comprar agora
            </button>
          </>
        )}
      </ProductDetails>
    </ProductContainer>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => { // correção aqui: async escrito errado
  
  return {
    paths: [
      // { params: { id: 'prod_NX0w3d3s9c2FID'} }
    ],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<ProductProps, { id: string }> = async ({ params }) => {
  const productId = params?.id; // adicionando ? para tratar a possibilidade de params ser nulo

  if (!productId) {
    return {
      notFound: true,
    };
  }

  const product = await stripe.products.retrieve(productId, { 
    expand: ['default_price'],
  })

  const price = product.default_price as Stripe.Price

  return { // Carregando dados do produto
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format((price.unit_amount ?? 0) / 100),
        description: product.description || null,
        defaultPriceId: price.id,
      }
    },
    revalidate: 60 * 60 * 1,
  }
}
