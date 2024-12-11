import { useSearchParams } from 'react-router-dom'
type getUrlQueryType = (e: string) => string | null

type setUrlQueryType<T> = { [key: string]: T }
type setUrlQueryTypeFunc = <T>(e: setUrlQueryType<T>) => void

const useUrlQueryHooks = (): [getUrlQueryType, setUrlQueryTypeFunc] => {
    const [searchParams, setSearchParams] = useSearchParams()

    const getUrlQuery = (key: string) => {
        return searchParams.get(key)
    }

    const setUrlQuery = <T>(newValue: setUrlQueryType<T>): void => {
        setSearchParams((searchParams: any) => {
            const prevParams: any = {}

            searchParams.forEach((v: any, k: any) => {
                prevParams[k] = v
            })
            return { ...prevParams, ...newValue }
        })
    }

    return [getUrlQuery, setUrlQuery]
}

export default useUrlQueryHooks
