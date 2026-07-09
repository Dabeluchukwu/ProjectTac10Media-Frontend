import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useState } from "react";


const Providers = ({ children }) => {


  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {

        queries: {

          retry: 1,

          refetchOnWindowFocus: false,

        },

      },

    })
  );



  return (

    <QueryClientProvider client={queryClient}>

      {children}

    </QueryClientProvider>

  );


};


export default Providers;