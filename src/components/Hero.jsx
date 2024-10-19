export default function Hero() {
    return (
        <>
            <h1>Coffe Tracking for Coffee <abbr title="An enthusiast or devottee">Friends</abbr></h1>
            <div className="benifits-list" >
                <h3 className="font-bolder" >Try <span className="text-gradient" >Caffiend</span> and start ...</h3>
                <p>✅ Tracking every coffee</p>
                <p>✅ Measuring your blood caffeine levels</p>
                <p>✅ Costing and quantifying your addition</p>
            </div>
            <div className="card info-card" >
                <div>
                    <i className="fa-solid fa-circle-info"></i>
                    <h3>Did you know...</h3>
                </div>
                <h5>That caffiene&apos;s half -life is about 5 hours?</h5>
                <p>This means after 5 hours, half the caffeiene you consumed is still in your system, keeping you aleert longer! So if you drink a cup of coffee with 200mg of caffeiene , 5 hours , later you&apos;ll still have about 100mg of caffiene in your system</p>
            </div>
        </>
    )
}