
export default function limitHandle(handle, delay,that) {
    let canRun = true;
    // console.log("limit this",this);//undefined
    return (e) => {
        let tar=e.currentTarget;
        if (canRun) {
            setTimeout(() => {
                // console.log("handle this ",this);//undefined
                handle.call(that,tar);
                canRun = true;
            }, delay)
        }
        canRun = false;
    }

}