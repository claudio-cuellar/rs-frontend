'use client';

import { InstantSearch, SearchBox, Hits, RefinementList, RangeInput, Configure, Stats, Pagination } from 'react-instantsearch';
import { searchClient, ALGOLIA_INDEX_NAME } from '@/lib/algolia';
import { PropertySearchHit } from '@/components/search/PropertySearchHit';
import { Search } from 'lucide-react';

export default function SearchPage() {
  return (
    <InstantSearch searchClient={searchClient} indexName={ALGOLIA_INDEX_NAME}>
      <Configure hitsPerPage={12} />
      
      <div className="min-h-screen bg-gray-50">
        {/* Search Header */}
        <div className="border-b bg-white">
          <div className="container py-6">
            <div className="mx-auto max-w-3xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <SearchBox
                  placeholder="Search by location, property type, features..."
                  classNames={{
                    root: 'w-full',
                    form: 'relative',
                    input: 'w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
                    submit: 'hidden',
                    reset: 'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600',
                  }}
                />
              </div>
              <div className="mt-3">
                <Stats
                  classNames={{
                    root: 'text-sm text-gray-600',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Filters Sidebar */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>

                {/* Listing Type */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900">Listing Type</h3>
                  <RefinementList
                    attribute="listing_type"
                    classNames={{
                      root: 'mt-2',
                      list: 'space-y-2',
                      item: 'flex items-center',
                      label: 'flex items-center gap-2 cursor-pointer text-sm',
                      checkbox: 'rounded border-gray-300 text-primary-600 focus:ring-primary-500',
                      count: 'text-xs text-gray-500 ml-auto',
                    }}
                    transformItems={(items) =>
                      items.map((item) => ({
                        ...item,
                        label: item.label === 'sale' ? 'For Sale' : 'For Rent',
                      }))
                    }
                  />
                </div>

                {/* Property Type */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900">Property Type</h3>
                  <RefinementList
                    attribute="property_type"
                    classNames={{
                      root: 'mt-2',
                      list: 'space-y-2',
                      item: 'flex items-center',
                      label: 'flex items-center gap-2 cursor-pointer text-sm capitalize',
                      checkbox: 'rounded border-gray-300 text-primary-600 focus:ring-primary-500',
                      count: 'text-xs text-gray-500 ml-auto',
                    }}
                  />
                </div>

                {/* Price Range */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900">Price Range</h3>
                  <RangeInput
                    attribute="price"
                    classNames={{
                      root: 'mt-2',
                      form: 'flex items-center gap-2',
                      input: 'w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
                      separator: 'text-gray-400',
                      submit: 'rounded bg-primary-600 px-3 py-1 text-sm text-white hover:bg-primary-700',
                    }}
                  />
                </div>

                {/* Bedrooms */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900">Bedrooms</h3>
                  <RefinementList
                    attribute="bedrooms"
                    classNames={{
                      root: 'mt-2',
                      list: 'flex flex-wrap gap-2',
                      item: '',
                      label: 'flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1 text-sm cursor-pointer hover:border-primary-500',
                      selectedItem: '[&_label]:bg-primary-50 [&_label]:border-primary-500 [&_label]:text-primary-600',
                      checkbox: 'sr-only',
                      count: 'text-xs text-gray-400',
                    }}
                  />
                </div>

                {/* City */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900">City</h3>
                  <RefinementList
                    attribute="city"
                    searchable
                    showMore
                    limit={5}
                    classNames={{
                      root: 'mt-2',
                      searchBox: 'mb-2',
                      list: 'space-y-2',
                      item: 'flex items-center',
                      label: 'flex items-center gap-2 cursor-pointer text-sm',
                      checkbox: 'rounded border-gray-300 text-primary-600 focus:ring-primary-500',
                      count: 'text-xs text-gray-500 ml-auto',
                      showMore: 'text-sm text-primary-600 hover:text-primary-700 mt-2',
                    }}
                  />
                </div>

                {/* State */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900">State</h3>
                  <RefinementList
                    attribute="state"
                    showMore
                    limit={5}
                    classNames={{
                      root: 'mt-2',
                      list: 'space-y-2',
                      item: 'flex items-center',
                      label: 'flex items-center gap-2 cursor-pointer text-sm',
                      checkbox: 'rounded border-gray-300 text-primary-600 focus:ring-primary-500',
                      count: 'text-xs text-gray-500 ml-auto',
                      showMore: 'text-sm text-primary-600 hover:text-primary-700 mt-2',
                    }}
                  />
                </div>
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1">
              <Hits
                hitComponent={PropertySearchHit}
                classNames={{
                  root: '',
                  list: 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3',
                  item: '',
                }}
              />

              <div className="mt-8 flex justify-center">
                <Pagination
                  classNames={{
                    root: 'flex gap-2',
                    list: 'flex gap-2',
                    item: '',
                    link: 'block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100',
                    selectedItem: '[&_a]:bg-primary-600 [&_a]:text-white [&_a]:hover:bg-primary-700',
                    disabledItem: '[&_span]:opacity-50 [&_span]:cursor-not-allowed',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </InstantSearch>
  );
}
