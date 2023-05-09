'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react';
import { IconType } from 'react-icons';
import queryString from 'query-string';

interface CategoryBoxProps {
    icon: IconType;
    label: string;
    selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
    icon:Icon, label, selected
}) => {
    const router = useRouter();
    const params = useSearchParams();

    const handleClick = useCallback(() => {
        let currentQuery = {} ; // {category: 'Beach'} 

        if(params){
            currentQuery = queryString.parse(params.toString()); 
        }; // if params is not empty, then parse it to object and assign it to currentQuery variable 

        const updatedQuery: any = {
            ...currentQuery,
            category: label,
        }; // if currentQuery is empty, then assign label to category property, otherwise, assign label to category property and override the previous value 

        if(params?.get('category') === label){
            delete updatedQuery.category;
        }; // if we click on the same category, then delete the category property from updatedQuery object and fetch all the properties

        const url = queryString.stringifyUrl({
            url:'/', 
            query: updatedQuery,
        },{
            skipNull: true,
        }); // stringify the updatedQuery object and assign it to url variable
        router.push(url); // push the url to the router 
    }, [label, params, router]);

  return (
    <div onClick={handleClick} className={`flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer 
    ${selected ? 'border-b-neutral-800' : 'border-transparent'}
    ${selected ? 'text-neutral-800': 'text-neutral-500'}
    `}>
        <Icon size={26}/>
        <div className='font-medium text-sm'>
            {label}
        </div>
    </div>
  )
}

export default CategoryBox;