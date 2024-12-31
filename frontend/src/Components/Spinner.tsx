import { ClipLoader } from "react-spinners"


export const Spinner = () =>{




    return <>
     <section
        style={{
          minHeight: "525px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ClipLoader size={150} />
      </section>
    </>

}