import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter, useSearchParams } from "next/navigation";

export interface CustomRouterOptions {
  preserveQuery: boolean;
}

export function useCustomRouter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Use window.location.href to get the current URL and route to it
  const cancelRoute = () => {
    const url = new URL(window.location.href);
    router.push(url.pathname + url.search);
  };

  const push = (
    href: string,
    routerOptions?: CustomRouterOptions,
    options?: NavigateOptions,
  ) => {
    // HACK: If relative URL given, stick the current host on the string passed to URL()
    // as the constructor throws an error if URL without a host is given
    try {
      if (typeof window === "undefined")
        throw new Error("Window is not defined");
      const url = new URL(
        href.includes("http") ? href : window.location.host + href,
      );
      // Force true
      if (routerOptions?.preserveQuery || true) {
        searchParams.forEach((val, key) => {
          url.searchParams.append(key, val);
        });
      }

      let urlString = url.toString();

      // If the href arg was relative, strip everything before the first '/' to
      // revert it back to a relative URL we can pass into the router.push() method
      if (!href.includes("http")) {
        urlString = urlString.substring(urlString.indexOf("/"));
      }

      router.push(urlString, options);
    } catch (error) {
      console.error("Error parsing URL", error);
      router.push(href, options);
    }
  };

  return { ...router, push, cancelRoute };
}
