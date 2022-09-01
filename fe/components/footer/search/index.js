import { Label } from "./style"
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
export default function Search() {
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();
  const onSearch = (data) => {
    
    let result = '';
    if(data.search.trim()) {
      result = encodeURIComponent(data.search.trim());
      router.push('/search/'+result);
      reset();
    }
  }

  return <>
    <form onSubmit={handleSubmit(onSearch)}>
      <Label htmlFor="search">Search: </Label>
      <input size="17" type="text" id="search" {...register("search")}/>
    </form>
  </>
}