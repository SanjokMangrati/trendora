"use client";
import {
    createContext,
    useState,
    useCallback,
    useContext,
    useMemo,
    ReactNode,
    useEffect,
} from "react";
import { Product } from "../types/product.types";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from "./session.context";

interface ProductsContextType {
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    loading: boolean;
    refetch: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const { toast } = useToast();
    const { sessionId } = useSessionContext();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchProductsDetail = useCallback(
        async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/products`,
                );
                if (!response.ok) throw new Error("Failed to fetch products");
                const data = await response.json();
                setProducts(data);
            } catch (error: any) {
                const errorMessage =
                    error instanceof Error ? error.message : "An error occurred";
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorMessage,
                });
            } finally {
                setLoading(false);
            }
        },
        [toast],
    );

    useEffect(() => {
        setLoading(true);
        if (sessionId)
            fetchProductsDetail();
    }, [sessionId])

    const value = useMemo(
        () => ({
            products,
            setProducts,
            loading,
            refetch: fetchProductsDetail
        }),
        [products, loading],
    );

    return (
        <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
    );
};

export const useProductsContext = () => {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error("useProductsContext must be used within ProductsProvider");
    }
    return context;
};
