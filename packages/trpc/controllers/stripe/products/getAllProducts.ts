import stripe from "@abuse-sleuth/stripe";
import { Stripe } from "@abuse-sleuth/stripe/Stripe";

import { trpc } from "../../../initTRPC";

export const getAllProductsController = trpc.procedure.query(
    async ({ input, ctx }) => {
        const products = await stripe.products.list({
            active: true,
            expand: ["data.default_price"],
        });

        const sortedProducts = products.data.sort((a, b) => {
            const aPrice = a.default_price as Stripe.Price;
            const bPrice = b.default_price as Stripe.Price;

            return (aPrice.unit_amount ?? 0) - (bPrice.unit_amount ?? 0);
        });

        return sortedProducts;
    }
);

export default getAllProductsController;
