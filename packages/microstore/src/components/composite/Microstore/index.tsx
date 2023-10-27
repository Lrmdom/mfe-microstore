import {
  SkusContainer,
  Skus,
  PricesContainer,
  AvailabilityContainer,
} from "@commercelayer/react-components"

import { ButtonBuyAll } from "../ButtonBuyAll"

import { Wrapper } from "./styled"

import { Hero } from "#components/composite/Hero"
import { Product } from "#components/composite/Product"
import { ProductWithVariants } from "#components/composite/ProductWithVariants"
import { SimpleSkuList, SkuWithPrices } from "#providers/SkuListProvider"

interface Props {
  skus?: SkuWithQuantity[]
  products?: Record<string, SkuWithPrices[]>
  skuList?: SimpleSkuList
  couponCode?: string
}

export const Microstore = ({
  skus = [],
  products = {},
  skuList,
  couponCode,
}: Props) => {
  if (skus.length === 0) {
    return (
      <div className="py-10 font-bold" data-test-id="no-skus-found">
        We could not find any products to display. Please check your URL and try
        again.
      </div>
    )
  }

  return (
    <>
      <Hero skuList={skuList} couponCode={couponCode} />
      <ButtonBuyAll />

      <Wrapper>
        {Object.keys(products).length === 0 ? (
          <SkusContainer skus={skus.map(({ skuCode }) => skuCode)}>
            <PricesContainer>
              <AvailabilityContainer>
                <Skus>
                  <Product />
                </Skus>
              </AvailabilityContainer>
            </PricesContainer>
          </SkusContainer>
        ) : (
          Object.keys(products).map((key) => (
            <ProductWithVariants
              key={key}
              skus={products[key]}
            ></ProductWithVariants>
          ))
        )}
      </Wrapper>
    </>
  )
}