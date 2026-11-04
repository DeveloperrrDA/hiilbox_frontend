import Link from "next/link";





import CampaignCategorySlider from "./CampaignCategorySlider";


import CampaignCards from "./CampaignCards";

import ThemeShell from "@/components/theme/ThemeShell";

import { getCampaigns, type CampaignsResponse } from "@/lib/campaigns";



export const dynamic = "force-dynamic";



interface CampaignsPageProps {

  searchParams: Promise<{

    page?: string;

    search?: string;

    category?: string;

    sort?: string;

  }>;

}






function campaignHref({

  page = 1,

  search = "",

  category = "",

  sort = "created_desc",

}: {

  page?: number;

  search?: string;

  category?: string;

  sort?: string;

}) {

  const params = new URLSearchParams();



  if (page > 1) params.set("page", String(page));

  if (search) params.set("search", search);

  if (category) params.set("category", category);

  if (sort && sort !== "created_desc") params.set("sort", sort);



  const query = params.toString();



  return query

    ? `/campaigns?${query}`

    : "/campaigns";

}

const campaignCategories = [

  { label: "All", slug: "" },

  { label: "Masjid", slug: "masjid" },

  { label: "Orphans", slug: "orphans" },

  { label: "Community", slug: "community" },

  { label: "Education", slug: "education" },

  { label: "Health", slug: "health" },

  { label: "Water", slug: "water" },

  { label: "Shelter", slug: "shelter" },

  { label: "Food Aid", slug: "food-aid" },

  { label: "Environment", slug: "environment" },

  { label: "Ramadan", slug: "ramadan" },

];

export default async function CampaignsPage({ searchParams }: CampaignsPageProps) {

  const params = await searchParams;

  

 const search = (params.search || "").trim();

const category = (params.category || "").trim();

const sort = (params.sort || "created_desc").trim();

const perPage = 100;



const sortOptions: Record<

  string,

  { orderby: string; order: "asc" | "desc" }

> = {

  created_asc: {

    orderby: "created_at",

    order: "asc",

  },

  created_desc: {

    orderby: "created_at",

    order: "desc",

  },

  start_asc: {

    orderby: "start_date",

    order: "asc",

  },

  start_desc: {

    orderby: "start_date",

    order: "desc",

  },

  end_asc: {

    orderby: "end_date",

    order: "asc",

  },

  end_desc: {

    orderby: "end_date",

    order: "desc",

  },

};



const selectedSort =

  sortOptions[sort] ?? sortOptions.created_desc;



 let campaigns: CampaignsResponse["data"] = [];
let errorMessage = "";

try {
  let currentPage = 1;
  let totalPagesToFetch = 1;

  do {
    const response = await getCampaigns({
      page: currentPage,
      per_page: perPage,
      search: search || undefined,
      category_slug: category || undefined,
      status: "published",
      orderby: selectedSort.orderby,
      order: selectedSort.order,
    });

    campaigns.push(...response.data);

    totalPagesToFetch = Math.ceil(
      response.pagination.total / perPage
    );

    currentPage++;
  } while (currentPage <= totalPagesToFetch);
} catch (error) {
  errorMessage =
    error instanceof Error
      ? error.message
      : "Unable to load campaigns.";
}

const total = campaigns.length;



  return (

    <ThemeShell>

      <main className="min-h-[70vh] bg-white">

        <section className="bg-white">

<div
  className="container-1218 text-center"
  style={{ paddingTop: "70px", paddingBottom: "48px" }}
>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#01A14B]">

              Make an impact

            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#111c2d] sm:text-5xl">

              Explore campaigns

            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#5a6a85]">

              Discover fundraisers and support the causes that matter to you.

            </p>



            <form action="/campaigns" method="get" className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">

              <label htmlFor="campaign-search" className="sr-only">

                Search campaigns

              </label>

              <input

                id="campaign-search"

                name="search"

                type="search"

                defaultValue={search}

                placeholder="Search campaigns..."

                className="min-h-12 flex-1 rounded-xl border border-[#dfe5eb] bg-white px-4 text-sm text-[#111c2d] outline-none transition placeholder:text-[#8c99aa] focus:border-[#01A14B] focus:ring-2 focus:ring-[#01A14B]/10"

              />

              <button

                type="submit"

                className="min-h-12 rounded-xl bg-[#01A14B] px-7 text-sm font-bold text-white transition hover:bg-[#018d42]"

              >

                Search

              </button>

            </form>

          </div>

        </section>



<section
  className="container-1218"
  style={{ paddingTop: "50px", paddingBottom: "56px" }}
>
          <CampaignCategorySlider

            items={campaignCategories.map((item) => ({

              label: item.label,

              href: campaignHref({ search, category: item.slug, sort }),

              active: category === item.slug,

            }))}

          />

          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <h2 className="text-2xl font-bold text-[#111c2d]">

                {search ? `Results for “${search}”` : "All campaigns"}

              </h2>

              {!errorMessage && (

                <p className="mt-1 text-sm text-[#6c7a90]">

                  {total === 1 ? "1 campaign" : `${total.toLocaleString()} campaigns`}

                </p>

              )}

            </div>



<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">  <form

    action="/campaigns"

    method="get"

   className="flex flex-wrap items-center gap-3"

  >

    {search && (

      <input

        type="hidden"

        name="search"

        value={search}

      />

    )}



    {category && (

      <input

        type="hidden"

        name="category"

        value={category}

      />

    )}



    <label

      htmlFor="campaign-sort"

      className="text-sm font-semibold text-[#5a6a85]"

    >

      Sort By

    </label>



    <select

      id="campaign-sort"

      name="sort"

      defaultValue={sort}

      className="min-h-11 rounded-xl border border-[#dfe5eb] bg-white px-3 text-sm font-semibold text-[#111c2d] outline-none focus:border-[#01A14B]"

    >

      <option value="created_desc">

        Created At — Newest First

      </option>



      <option value="created_asc">

        Created At — Oldest First

      </option>



      <option value="start_desc">

        Start Date — DESC

      </option>



      <option value="start_asc">

        Start Date — ASC

      </option>



      <option value="end_desc">

        End Date — DESC

      </option>



      <option value="end_asc">

        End Date — ASC

      </option>

    </select>



    <button

  type="submit"

  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#01A14B] px-5 text-sm font-bold text-[#01A14B] transition hover:bg-[#01A14B] hover:text-white"

>

  Apply

</button>

  </form>





</div>

          </div>



          {errorMessage ? (

            <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">

              <h3 className="text-lg font-bold text-[#111c2d]">Campaigns could not be loaded</h3>

              <p className="mt-2 text-sm text-[#6c7a90]">{errorMessage}</p>

              <Link href="/campaigns" className="mt-5 inline-block text-sm font-bold text-[#01A14B]">

                Try again

              </Link>

            </div>

          ) : campaigns.length === 0 ? (

            <div className="rounded-2xl border border-[#e6ebf0] bg-white p-10 text-center">

              <h3 className="text-xl font-bold text-[#111c2d]">No campaigns found</h3>

              <p className="mt-2 text-sm text-[#6c7a90]">

                {search ? "Try a different search term." : "There are no published campaigns yet."}

              </p>

              {search && (

                <Link href="/campaigns" className="mt-5 inline-block text-sm font-bold text-[#01A14B]">

                  View all campaigns

                </Link>

              )}

            </div>

          ) : (

            <>

            <CampaignCards campaigns={campaigns} />


              
            </>

          )}

        </section>

      </main>

    </ThemeShell>

  );

}
