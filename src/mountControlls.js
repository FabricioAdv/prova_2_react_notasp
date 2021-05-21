import { useEffect } from 'react';

function useDidMount (func)
{
    useEffect(() =>
    {
        func();
    }, []);
}

export default useDidMount;