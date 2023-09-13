import { useEffect, useState, useRef } from 'react'
import { trpc } from '../utils/trpc'
import { useRouter } from 'next/router'
import { inferProcedureInput } from '@trpc/server'
import ReactTags from 'react-tag-autocomplete'
import { AppRouter } from '~/server/routers/_app'


interface ITagProps {
  onTagAdd: (tag: { id: string|undefined, name: string }) => void
}


const AddTag = (props: ITagProps) => {
  const addTag = trpc.tag.add.useMutation({})
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([]);
  const tagQuery = trpc.tag.list.useQuery({limit: 100})


  const ref = useRef();

  useEffect(() => {
    if(tagQuery.data?.items?.length) {
      setTags(tagQuery.data.items)
    }
  }, [tagQuery.data])


  if(tagQuery.isLoading)
    return <div>Loading Tags</div>

  const onAddition = async (tag) => {

    setSelectedTags([...selectedTags, tag])

    try {
      type Input = inferProcedureInput<AppRouter['tag']['add']>
      const input: Input = {
        name: tag.name
      }
      await addTag.mutateAsync(input)
      setTags([...tags,tag])
      props.onTagAdd(tag)
    } catch (e) {
      console.error(e, 'Failed to add post')
    }
  }

  const router = useRouter()
  return (
    <>
      <ReactTags
        ref={ref}
        tags={selectedTags}
        suggestions={tags}
        onDelete={console.log}
        allowNew={true}
        onAddition={onAddition}
        autoresize={false}
      />
    </>
  )
}

export default AddTag
