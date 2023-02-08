import type { PageLoad } from './$types';
import Surreal from 'surrealdb.js';
import { user } from '$lib/stores';
import { PUBLIC_SURREAL_URL, PUBLIC_SURREAL_NAMESPACE, PUBLIC_SURREAL_DATABASE } from '$env/static/public';
import { get } from 'svelte/store';

 
export const load = (async ({ fetch, params }) => {
	const db = new Surreal(`${PUBLIC_SURREAL_URL}/rpc`);

  let existingUser = get(user);

  try {
    if (existingUser) {
     	await db.signin({
    		NS: PUBLIC_SURREAL_NAMESPACE,
    		DB: PUBLIC_SURREAL_DATABASE,
    		SC: 'end_user',
    		email: existingUser.email,
    		pass: existingUser.password,
    	});
    }

  	await db.use(PUBLIC_SURREAL_NAMESPACE, PUBLIC_SURREAL_DATABASE);
  } catch (e) {
    console.log(e)
  }

  // Should we order by anything ?
  // let media = await db.select("media");

  return {
    // media,
  };
 
}) satisfies PageLoad;