import { countries } from "../../../configs/countries";
import { sectors } from "../../../configs/sectors";
export async function GET() {
  try {
    // country nikali
    let DEs = "DE"
    let De = countries[DEs]
    let pass_through_rate = De.pass_through_rate

    // sector nikala
    let logi = "logistics"
    let se = sectors[logi]
    let sensitivity_score = se.sensitivity_normalised

    let spend_bracket = 52500
    let brent_30_days_move = -22.5

    let calcobj = brent_30_days_move * pass_through_rate * sensitivity_score * spend_bracket

    return Response.json({ articles: calcobj});
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Scraping failed" }, { status: 500 });
  }
}