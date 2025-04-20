export interface PaginatedResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      direction: string
      nullHandling: string
      ascending: boolean
      property: string
      ignoreCase: boolean
    }[]
    offset: number
    paged: boolean
    unpaged: boolean
  }
  totalPages: number
  totalElements: number
  last: boolean
  size: number
  number: number
  sort: {
    direction: string
    nullHandling: string
    ascending: boolean
    property: string
    ignoreCase: boolean
  }[]
  numberOfElements: number
  first: boolean
  empty: boolean
}
