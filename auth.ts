import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import {AUTHOR_BY_GITHUB_ID_QUERY} from "@/sanity/lib/queries";
import {client} from "@/sanity/lib/client";
import {writeClient} from "@/sanity/lib/writeClient";
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user : { name, email, image }, profile : { id, login, bio } }){
      const existingUser = await client.withConfig({ useCdn: false}).fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
        id: id,
      })
      if(!existingUser){
        await writeClient.create({
          _type: "author",
          id,
          name ,
          username: login,
          email ,
          image ,
          bio: bio || "",
        });
      console.log("signIn Callback Received" + {existingUser})
      }
      return true;
    },
    async jwt({token, account, profile}) {
      if (account && profile) {
        const user = await client.withConfig({useCdn: false}).fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
          id: profile?.id
        });
        token.id = user?._id
      }
      console.log("jwt token Callback received")
      return token
    },
    async session({session, token}) {
      Object.assign(session, {id: token.id});
      console.log(`session callback received for : ${session}`)
      return session;
    }
  },
})