import { HomeContainer, Product } from '@/styles/pages/home'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { stripe } from '@/lib/stripe'
import { GetStaticProps } from 'next'
import Stripe from 'stripe'
import Image from 'next/image'
import Link from 'next/link'
// // import camiseta1 from '../assets/camisetas/1.png'

interface Product { 
  id: string;
  name: string;
  imageUrl: string;
  price: string;
}

interface HomeProps { // Buscando produtos do Stripe
  products: Product[];
}

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    }
  });

  return (
    <HomeContainer ref={sliderRef} className="keen-slider">
      {products.map((product) => (
        <Link href={`/product/${product.id}`} key={product.id} passHref>
          <Product className="keen-slider__slide">
            <Image src={product.imageUrl} width={520} height={480} alt="" />
            <footer>
              <strong>{product.name}</strong>
              <span>{product.price}</span>
            </footer>
          </Product>
        </Link>
      ))}
    </HomeContainer>
  );
}

export const getStaticProps: GetStaticProps = async () => { // Utilizando SSG com getStaticProps armazenando no cache 
  const response = await stripe.products.list({
    expand: ['data.default_price']
  })

  const products = response.data.map(product => { // Buscando produtos do Stripe
    const price = product.default_price as Stripe.Price
    
    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format((price.unit_amount ?? 0) / 100)
    }
  })

  return {
    props: {
      products,     
    },
    revalidate: 60 * 60 * 2, // 2 horas
  }
}

{/* <pre>{JSON.stringify(products)}</pre>

<Product className="keen-slider__slide" data-test="product-1">
  <Image src={camiseta1} width={520} height={480} alt="" data-test="product-image" />

  <footer>
    <strong data-test="product-name1">
      Camiseta X
    </strong>
    <span data-test="product-price1">R$ 79,90</span>
  </footer>
</Product>

<Product className="keen-slider__slide" data-test="product-2">
  <Image src={camiseta2} width={520} height={480} alt="" />

  <footer>
    <strong data-test="product-name2">
      Camiseta X
    </strong>
    <span data-test="product-price2">R$ 79,90</span>
  </footer>
</Product>

<Product className="keen-slider__slide" data-test="product-3">
  <Image src={camiseta3} width={520} height={480} alt="" />

  <footer>
    <strong data-test="product-name3">
      Camiseta X
    </strong>
    <span data-test="product-price3">R$ 79,90</span>
  </footer>
</Product> */}
