export const environment = process.env.NEXT_PUBLIC_API_ENV || 'local'
export const defaultNetwork = process.env.NEXT_PUBLIC_NETWORK

const settings = {
  fkcgame: process.env.NEXT_PUBLIC_CONTRACT_FKCGAME,
  fkccontroller: process.env.NEXT_PUBLIC_CONTRACT_FKCCONTROLLER
}

export const configuration = settings;