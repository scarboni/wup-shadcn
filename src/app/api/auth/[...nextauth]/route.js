import { handlers } from "@/auth";

// Force dynamic — prevent static pre-rendering during build
export const dynamic = "force-dynamic";

export const { GET, POST } = handlers;
