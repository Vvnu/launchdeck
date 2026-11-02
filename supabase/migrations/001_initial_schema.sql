
-- 1. USER PROFILES
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    tagline TEXT,
    description TEXT,
    website_url TEXT,
    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'launched')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SUBSCRIPTIONS
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prevent duplicate subscriptions for the same product
CREATE UNIQUE INDEX subscriptions_product_email_unique
ON public.subscriptions (product_id, LOWER(email));

-- 4. FEEDBACK
CREATE TABLE public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    email TEXT,
    message TEXT NOT NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PERFORMANCE INDEXES
CREATE INDEX products_owner_id_idx
ON public.products(owner_id);

CREATE INDEX products_status_idx
ON public.products(status);

CREATE INDEX subscriptions_product_id_idx
ON public.subscriptions(product_id);

CREATE INDEX feedback_product_id_idx
ON public.feedback(product_id);




ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;





-- PROFILES: users can read and update their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());


-- PRODUCTS: everyone can view launched products
-- Owners can also view their drafts
CREATE POLICY "Public can view launched products"
ON public.products FOR SELECT
TO anon, authenticated
USING (status = 'launched' OR owner_id = auth.uid());

CREATE POLICY "Users can create own products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update own products"
ON public.products FOR UPDATE
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can delete own products"
ON public.products FOR DELETE
TO authenticated
USING (owner_id = auth.uid());


-- SUBSCRIPTIONS: visitors can subscribe to launched products
CREATE POLICY "Public can subscribe"
ON public.subscriptions FOR INSERT
TO anon, authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.products
        WHERE products.id = product_id
        AND products.status = 'launched'
    )
);

-- Only product owners can read their subscribers
CREATE POLICY "Owners can view subscribers"
ON public.subscriptions FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.products
        WHERE products.id = product_id
        AND products.owner_id = auth.uid()
    )
);


-- FEEDBACK: visitors can submit feedback
CREATE POLICY "Public can submit feedback"
ON public.feedback FOR INSERT
TO anon, authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.products
        WHERE products.id = product_id
        AND products.status = 'launched'
    )
);

-- Only owners can view feedback
CREATE POLICY "Owners can view feedback"
ON public.feedback FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.products
        WHERE products.id = product_id
        AND products.owner_id = auth.uid()
    )
);




CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data ->> 'full_name'
    );

    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
