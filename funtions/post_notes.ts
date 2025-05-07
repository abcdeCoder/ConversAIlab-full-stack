// POST /notes - chosen because this endpoint inserts a new note; reads from the request body.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const { title, content } = await req.json()

  const { data, error } = await supabase
    .from("notes")
    .insert([{ title, content, user_id: user.id }])
    .select()

  if (error) return new Response(JSON.stringify(error), { status: 500 })

  return new Response(JSON.stringify(data[0]), {
    headers: { "Content-Type": "application/json" },
  })
})
