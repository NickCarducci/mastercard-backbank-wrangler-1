//struct PotentialType<T>(T);

//use serde::Serialize;
use worker::{
  async_trait, durable_object, js_sys, wasm_bindgen, wasm_bindgen_futures, worker_sys, Env,
  Request, Response, Result, State,
};
pub use worker_sys::{console_debug, console_error, console_log, console_warn};
/*#[derive(Serialize)]
struct Product {
  ivity: String,
}
struct Clo;
impl Clone for worker::Response {
  fn clone(&self) -> Self {
    Foo {
      a: self.a.clone(),
      b: self.b.clone(),
      c: self.c.clone(),
    }
  }
}

#[derive(Serialize, Deserialize)]
#[serde(remote = "worker::Response")]
struct Noth {
  ing: String,
}

//#[derive(Serialize, Deserialize)]
//#[serde(remote = "diesel::result::Error")]
#[derive(Deserialize)]
struct Helper(#[serde(with = "Noth")] worker::Response);

#[derive(Clone)]
struct Reading<T> {
    frequency: T,
}*/

#[durable_object]
pub struct DurableObjectExample {
  app: String, //usize,//Result<Response>, //String, //Vec<u8>,
  initialized: bool,
  state: State,
  env: Env, // access `Env` across requests, use inside `fetch`
}

/*fn pathify(path: &str) -> std::path::PathBuf {
  let mut input_file = std::path::PathBuf::new();
  let _arr: () = path.split("/").map(|x| input_file.push(x)).collect();
  return input_file;
}*/
/*struct Closure1 {
    client: (),
}
impl FnOnce for Closure1 {
    type Output = ();
}*/
/*const Leg: Body = Body {
  page_offset: [""].map(String::from).to_vec(),
  page_length: [""].map(String::from).to_vec(),
  postal_code: [""].map(String::from).to_vec(),
};
#[derive(Copy)]
enum Organ {
  Leg,
}*/
trait Boody {
  fn clone_dyn(&self) -> Box<dyn Boody>;
}
use serde::{Deserialize, Serialize};
#[derive(Serialize, Deserialize, Debug, Clone)] //https://stackoverflow.com/questions/58422438/struct-with-partial-move-errors
#[serde(rename_all = "camelCase")] //https://github.com/serde-rs/serde/issues/1435
struct Body {
  //miracle:Organ,
  page_offset: Vec<String>,
  page_length: Vec<String>,
  postal_code: Vec<String>,
}
impl Boody for Body {
  fn clone_dyn(&self) -> Box<dyn Boody> {
    Box::new(Body {
      page_offset: self.page_offset.clone(),
      page_length: self.page_length.clone(),
      postal_code: self.postal_code.clone(),
    })
  }
}

impl Clone for Box<dyn Boody> {
  fn clone(&self) -> Self {
    self.clone_dyn()
  }
} //https://stackoverflow.com/questions/67251470/type-does-not-implement-copy-error-when-using-supertrait-of-copy-in-an-enum

//use serde::{Deserialize, Serialize};
#[derive(Serialize, Deserialize, Debug, Clone)] //https://stackoverflow.com/questions/58422438/struct-with-partial-move-errors
#[serde(rename_all = "camelCase")] //https://github.com/serde-rs/serde/issues/1435
struct Bodi {
  page_offset: Vec<String>,
  page_length: Vec<String>,
  postal_code: Vec<String>,
}
/*impl Clone for Body {
    fn clone(&self) -> Self {
        // *self
  page_offset.clone(),
  page_length: String,
  postal_code: String,
    }
}*///https://stackoverflow.com/questions/65677430/how-to-fix-string-field-does-not-implement-copy
/*impl Copy for Body {}
impl Clone for Body {
  fn clone(&self) -> Body {
    Body {
      page_offset: self.page_offset.clone(),
      page_length: self.page_length.clone(),
      postal_code: self.postal_code.clone(),
    }
  } //camillia christine kinarsi , "hillary never attacked nurses advocate blacklists you"
}*/
//https://stackoverflow.com/questions/27876588/why-is-the-copy-trait-needed-for-default-struct-valued-array-initialization
/*const Leg: Body = Body {
          page_offset: "".to_string(),
          page_length: "".to_string(),
          postal_code: "".to_string(),
          };
enum Organ {
    Leg
}//console_log("{}",);console_log("{:?}",)
`index::Body` doesn't implement `std::fmt::Display`
`index::Body` cannot be formatted with the default formatter
impl std::fmt::Display for Body {
  fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
    match *self {
      Leg::page_offset(a) => write!(f,"{}",a)
    }
  }
}*/
/*struct IsString(String);
impl std::fmt::Debug for IsString {
  /*fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
    Ok(())
  } *///Self::Output
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    f.debug_tuple("IsString") /*.field(&self.0)*/
      .finish()
  } //https://doc.rust-lang.org/std/fmt/trait.Debug.html
}*/
//https://stackoverflow.com/questions/22243527/how-to-implement-a-custom-fmtdebug-trait
//https://juliano-alves.com/2020/01/06/rust-deserialize-json-with-serde/
#[durable_object]
impl DurableObject for DurableObjectExample {
  fn new(state: State, env: Env) -> Self {
    Self {
      app: "".to_string(), //0,//Response::from_json(serde_json::json!({})), //"initialapp".to_owned(), //format!(""),vec![]
      //https://www.hackertouch.com/how-to-create-and-check-string-is-empty-rust.html
      initialized: false,
      state: state,
      env,
    }
  } //https://github.com/cloudflare/durable-objects-template/issues/14
    //"Can't read from request stream after response has been sent" or just read _req (?)
  async fn fetch(&mut self, req: Request) -> Result<Response> {
    //let _state = &self.state;
    let _env = &self.env;
    //let _req = req; //.arrayBuffer();
    //if (!_req.url)
    //return R({ response: "abnormal" }, [400, "abnormal", dataHead]);

    //let url = new URL(_req.url);
    //let  value = null;
    //self.state.storage().put("app", self.app).await?;
    //let mut s = req.clone()?; //.unwrap();
    //serde_json::to_string(&s);
    //let body: Body = ResponseBody::Body(s.bytes().await?);
    /*let _body = serde_json::json!(s.bytes().await?); / *match s.json().await {
      Ok(body) => body,
      Err(m) => {
        console_log!("{}", m);
        let g: Body = Body {
          page_offset: "0".to_owned(),
          page_length: "1".to_owned(),
          postal_code: "00000".to_owned(),
        };
        g
      }
    };*/
    let body = match req.clone()?.bytes().await {
      Ok(app) => serde_json::json!(app),
      Err(a) => {
        let g = |a| a;

        console_log!("{}", g(a));
        serde_json::json!({})
      }
    }; /*[123,34,112,97,103,101,79,102,102,115,101,116,34,58,34,48,34,44,34,112,97,103,
       101,76,101,110,103,116,104,34,58,34,49,48,34,44,34,112,111,115,116,97,108,67,111,
       100,101,34,58,34,48,55,55,48,52,34,125];*/
    console_log!("{}", body);
    //.clone();//.clone()?; serialize as json

    //console_log!("{:?}", serde_json::to_string(&body));
    //serialize as json (with struct)
    let bodi = match req.clone()?.json().await {
      Ok(app) => {
        let bodi: Bodi = app;
        bodi
      }
      Err(a) => {
        let g = |a| a;

        console_log!("{}", g(a));
        Bodi {
          page_offset: [""].map(String::from).to_vec(),
          page_length: [""].map(String::from).to_vec(),
          postal_code: [""].map(String::from).to_vec(),
        }
      }
    }; //.unwrap();?catch
       /*
       "Body { page_offset: \"0\", page_length: \"10\", postal_code: \"07704\"*/
    console_log!("{:?}", bodi);
    let _page_offset = bodi.page_offset;
    let _page_length = bodi.page_length;
    let _postal_code = bodi.postal_code;

    /*if IsString(_page_offset)//validreturn!(IsString(_page_offset), _page_offset)
      && validreturn!(String, _page_offset)
      && validreturn!(String, _page_offset)
    {
      console_log!(
        "{}",
        _page_offset.to_owned() + &_page_length + &_postal_code
      )
    };*/
    if !self.initialized {
      self.initialized = true; //serde_json::json!();::<Result<Response>>
                               //let cop = bodi.clone(); //let cop = body.clone();
      self.app = self
        .state
        .storage()
        .get("app")
        .await
        .unwrap_or(serde_json::to_string(&Body {
          page_offset: [""].map(String::from).to_vec(),
          page_length: [""].map(String::from).to_vec(),
          postal_code: [""].map(String::from).to_vec(),
        })?); /*match self.state.storage().get("app").await {
                Ok(app) => {
                  //'Some' when ? -> Option, 'Ok' when -> Result
                  let app: Result<Response> = app;
                  app
                  // app
                } //uses the default from new //.unwrap_or(self.app.to_owned()
                Err(a) => {
                  //struct St(String);
                  //.unwrap_or(self.app.to_owned()
                  //let g = a::fmt;//.backtrace;

                  /*impl std::fmt::Display for a {
                  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
                    match *self {
                        Suit::Heart => write!(f, "♥"),
                        Suit::Diamond => write!(f, "♦"),
                        Suit::Spade => write!(f, "♠"),
                        Suit::Club => write!(f, "♣"),
                    }
                  }*/
                  //a::from();extracongressional//finance has ruined marriage as duress as well as homeless
                  let g = |a| a; //format!()

                  console_log!("{}", g(a)); //extend push append// [dummy,vec!(0)].concat()
                                            //let dummy: Vec<String> = Vec::new();
                                            //let s:Vec<String> = "   ".as_bytes().to_vec();
                                            //vec!["".to_string()]
                                            //let s: Vec<String> = vec![String::from_utf8_lossy(u8::from_be_bytes([]).as_bytes()).to_string()];
                                            //.as_bytes().to_vec().iter().map(|&s|s.into()).collect();// String{vec:/*std::str::from_utf8(*/ "".as_bytes().to_vec()}; //[dummy,vec!(0)].concat()}//"".to_vec().as_bytes()).unwrap().to_string())}
                  "".to_string()
                }
              };*/
    }
    /*
        We can also handle the mapping as a std::borrow::Cow to make vec! macro [clone on write] last concurrently. I guess that's "lossy" for you:
    declare a lossy clone-to-be `&str` literal array as bytes before .
    let literally = ["", ""]
      .into_iter()
      .map(|x| String::from_utf8_lossy(x.as_bytes()).to_string())
      .collect();
    let s: Vec<String> = vec![literally];
    I (am also new to rust and) have not checked all use cases (multiple slices of strings - ok?) but rustup with VirtualStudio code analyzer is telling my folder that `s` type-defined variable is std::vec::Vec<std::string::String>.
    Probably trading process for modularity (by mapping over lossy bytes), if readability determinations were notwithstanding (unless this very thing is abstracted, which I doubt).
        */

    fn set(x: [&str; 2]) -> Vec<String> {
      let literally: String = x.into_iter().map(String::from).collect();
      vec![literally] //vec![literally];
    }
    let _s = set(["", ""]); //https://www.reddit.com/r/learnrust/comments/h82em8/best_way_to_create_a_vecstring_from_str/iibjabv/?context=3
                            //self.env.secret("SOME_SECRET")?.to_string();
                            //dyn std::future::Future<worker::Response>
                            /*pub trait FnOnce<Args> {
                              type Output;

                              extern "rust-call" fn call_once(self, args: Args) -> Self::Output;
                            }
                            fn consume_with_relish<F>(func: F)
                            where
                              F: FnOnce() -> worker::Response,
                            {
                              call_once()
                              //func() then use of moved value` error
                            }*/
    /*let v = */
    match self
      .state
      .storage()
      .put("app", &serde_json::json!(&self.app))
      .await
    {
      Ok(app) => {
        //'Some' when ? -> Option, 'Ok' when -> Result
        app
        // app
      } //uses the default from new //.unwrap_or(self.app.to_owned()
      Err(a) => {
        //struct St(String);
        //.unwrap_or(self.app.to_owned()
        //let g = a::fmt;//.backtrace;

        /*impl std::fmt::Display for a {
        fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
          match *self {
              Suit::Heart => write!(f, "♥"),
              Suit::Diamond => write!(f, "♦"),
              Suit::Spade => write!(f, "♠"),
              Suit::Club => write!(f, "♣"),
          }
        }*/
        //a::from();extracongressional//finance has ruined marriage as duress as well as homeless
        let g = |a| a; //format!()

        console_log!("{}", g(a)); //extend push append// [dummy,vec!(0)].concat()
                                  //let dummy: Vec<String> = Vec::new();
                                  //let s:Vec<String> = "   ".as_bytes().to_vec();
                                  //vec!["".to_string()]
                                  //let s: Vec<String> = vec![String::from_utf8_lossy(u8::from_be_bytes([]).as_bytes()).to_string()];
                                  //.as_bytes().to_vec().iter().map(|&s|s.into()).collect();// String{vec:/*std::str::from_utf8(*/ "".as_bytes().to_vec()}; //[dummy,vec!(0)].concat()}//"".to_vec().as_bytes()).unwrap().to_string())}
                                  //"".to_string()
      }
    };
    //.and_then(consume_with_relish(relish));
    //let relish =
    /*async move {
      match req.path().as_str() {
        "/" => Response::from_json(&Product {
          ivity: self.app.to_string(),
        }),
        &_ => Response::from_json(&Noth { ing: "".to_owned() }), /*"/" => Response::ok(&format!(
                                                                   "[durable_object]: self.app: {}", //secret value: {}",
                                                                   self.app,
                                                                   //self.env.secret("SOME_SECRET")?.to_string()
                                                                 ))*/
      }
      //return Response::ok("");
      //let lock: std::path::PathBuf = pathify("./exec.c");
      //let _app = &self.app;//hardly any use to add the c>php code to the keyvalue storage
      //self.app: Vec<v8> = extensionfrom cc::Build().expand
      //self.app: String = String::from_utf8(self.app).unwrap();
      //self.state.storage().put("app", self.app).await?;
      //let appel: Vec<u8> = cc::Build::new().file(lock).expand();
      /*return*/ /*self.data = *///Response::ok(String::from_utf8(appel).unwrap())
      //self.data = data::to_string();//https://doc.rust-lang.org/std/macro.format.html
      //return Response::ok(&format!("{} data.", self.data));
    }
    .await*/
    /*Response::from_json(&Product {
      ivity: async {self.app}await.to_string(),
    })*/
    Response::ok(&format!(
      "[durable_object]: self.app: {}", //, secret value: {}",
      serde_json::json!(&self.app)      //?.string(),
                                        //self.env.secret("SOME_SECRET")?.to_string()
    ))
    //.or_else(|err| Response::error(err.to_string(), 500));
  }
}
//advocates against false advertisement and countersuables
//lock up the italians::sweaty
//profits are only left over value than utility is valuation by payment installments
//inelasticity as left over
//flip phillips to misery to complementary

//better effort for deflating efficiency than non-accelerating inflation rate of unemployment

//if I cannot say kill russians on facebook but likely cannot donate without being red flagged
//asylum for conscripts
//repo credit purchases, inventory no debit in debenture/stock fiduciary... only by royalty gives debenture a different name

//worked at it through the generations
//Is propensity exclusively genetic part of athleticism potential?

//the shim is my business partner
//you are making yourself look bad (NBER/truncatedwholesaletax.com) you don't think skirt

//politics is to choose the null move when the cohort can teach themselves (the thing)
//don't talk over the nuts

//shut up faggot ummah! Talaq brothers and sisters

//need to move on from wall st, my _ rn
//you gotta want it

//rape by no condom? duress(?)

/*I sometimes think how my writing style is mandirin english
after spending some time on that. This bio's prose is however more for the arc.*/

//"run amock, do what they want, everything" ken belkin 10% for the big guy
//declare 'it' properly/define ‘it’

//harassment

//FEMA incentivizing illegal immigration with subsidy
//as existing business does subsidy

//millions of other customers would vote to love

//NBER concentration income/institutional gifts and housing(retreats) employee benefits taxes

//market concentration is destroyed by technology

//destroy paywall, join WIPO, communist no gov

//regulation like most fracking not paywal exclusionary non-substitutive
//you can stop fraud, old people and youth victims
//Well, if Hunter Biden actually made a deal AUXILIARY TO CONGRESSIONAL APPROPRIATIONS
//with (1) gifts to Joe Biden, the (2) admitting to it though text messages would ACTUALLY
//be incriminating (with grounds of selling his office) instead of ‘just politics’ or what have you that is merely rhetorical.

//salaam talaq usury fraud bartenders must (Mahr)

//need mahr/dowry or relent from it
//'sue [government]' embezzlement fiduciary [for not fining] take your meds!

//elephants
//mutations not inseminations
//transaction records instead of sms supoena foreign agent [relational affairs]
//biden is fracking more than ever
//77 wabc consistently does disinformation this stuff can all be found online

//social security office do not give a lick to the non-speaking developmentally disabled and injured
//35.4% 5.2% 7% 48% age-related who can drive Uber with a diaper

//How many conservatives would trade mercantilism for saving social programs on .3%+ of the potential population from immigration?

//i don't know who is going to disagree with you .. approval rate is the same people and adbusters' occupy corporate greed is otherwise

//indirect mechanisms are fraudulent social choice program except for royalty contract, and
//they aren't exclusionary as ascertainable monopoly by royalty payday

//corporation representation buy a t shirt or hat
//igg.me/at/occupywallstreet / fracking more than ever... revelative

//hospital is for surgery not attenuation

//all verticals are fixed startup costs of one another at the end of the day (not just semiconductors), even the unreal tax exempt
//that allows the NBER recession to happen when people start paying tax exempt employee benefits uh after income
//let's vote out Bob "right-to-try" Menendez with elastic supply named riots before we self stunt and resolve this
//non-diplomatically. Should we take in Russian asylum for a mercantilist conservative perspective

//truncated wholesale tax geohash month world peace protocol

//$15/customer/yr discounted gifts

/*I am injured ([by sports injury](https://www.google.com/maps/reviews/@40.226143,-74.010427,17z/data=!3m1!4b1!4m5!14m4!1m3!1m2!1s116647982166856941576!2s0x0:0x378cebad53d3cd2f?hl=en-US)) but was [called schizophrenic](https://www.google.com/maps/reviews/@40.3536779,-74.0639766,17z/data=!3m1!4b1!4m5!14m4!1m3!1m2!1s116647982166856941576!2s0x0:0xfe73b6ff732230da?hl=en-US).  I am a bartender, otherwise I will not take fraud as income. For this I looked into the 2018 National Beneficiary Survey (next one estimated release 2023) that says of 4062 reporters **35.4% are mentally ill, 5.2% with developmental disability, and 14.9% are injured** (or poisoned) in 2015. For a picture of the **Musculoskeletally-disordered of 42.1%**, we can use the [Center on Budget and Policy Priorities](https://www.cbpp.org/research/social-security/social-security-disability-insurance-0) [reports](https://www.cbpp.org/typical-disabled-worker-is-over-50-and-has-severe-mental-musculoskeletal-or-other-impairment-2) to get an age-related image. So, other than age, what injuries constitute a proper claim? Is it only when something (1) falls on you (2) on the job?

[![Center on Budget and Policy Priorities][1]][1]

[![National Beneficiary Survey, 2015][2]][2]


  [1]: https://i.stack.imgur.com/jA38q.png
  [2]: https://i.stack.imgur.com/4sOtJ.png*/

//  "liberal and left left-ist" practice - pascal

//adbusters is just politcal
//conservatives hate parts of empire vertical costs
//communist proletariat dictatorship non-chattle mercantilism
//surplus ability needs ends

//occupy is just political
//salty socialist squirrels
//no exclusion by corporate subsidy nor yet vulgar socialism but
//for actual injury (including sports) "dougen anti-marxism, broadenism"
//ban the governments

//dougan marxist
//"win/understand base, other side don't reject"

//fraud "rsdym WWII flipped" "baristagate patriotic theories of surplus value, service workers are not industrial-proles"
//"union health i" service = blue hair/pmc.. every vertical is in service of the other

//Talaq implies Mahr/dowry... flog otherwise (including urusy).. defiling "cut off" ... torah "[death]" to flog to talaq
//need to pay talaq/dowry lawyer before the death sentence

//https://law.stackexchange.com/questions/82673/what-kinds-of-injuries-are-covered-by-social-security

//make sure it is reciprocol force is never love, consent by duress is not but for surplus value. finance has ruined marriage as per consent

//is a second opinon not embezzlement
//is physical injury second opinon social security not embezzlement

//constitution, system and what is right

//plea duress/ civil suit/ cop admissible not evidence sure yet not motive as testimony

//ask how much money? how to prove it did hapopen to desist no more than 1/12 (warning order// AJ meds)

//FDA is animal abuse

//minority "worth it" fiduciary embezzlement not fining judges for successful appeals
//these kinds of thinks for pitfall -"smears" you need to decide, your leader wanit want the issue is why it work, waste time misrepresent by ambiguity to claim others misrepresent

//how is How do socialists spend the proletariat industrial class?

//quantity demanded is not complementary leisure exchanged for ability need
//price is dependent on quantity and independent to the individual revelative

/*
Have you not heard of marginal utility? Every entrant into the given market is
sorted by their propensity to enter by preference and fixed startup costs to supply
themselves and others. Supply can be complementary with demand more atomically than
the non accelerating inflationary rate of unemployment as atomicity begets (Phillips/misery).

Why are you treating every marginal utility as the total utility itself instead of as its base?
The individuals can be price takers as supply is inelastic, yet in an efficient market where supply
is complementary with demand the latter are price givers by budget constraints sorted-by/per preferences
and fixed startup costs to substitute as supply.
*/

//Why is there no insemination only mutations in immunofluorescent microscopy studies of amino acid in lipids' endocytosis of cells?
/*

I don't understand how (2) taxonomically (`paraphyletically`) virion may be without a last common ancestor nor (3) evolutionary reason, to boot the absence of `vivo` as `virion+cell` instead of `cell+mRNA`.

My theory is that *virion is debris that antibodies have evolved* to **garbage collect** (to prevent cardiovascular clotting, my grandfather was a cardiologist-lawyer which might have imposed itself on my predilection, if it is just that).

I think if you think evolution process product is to release from cells instead of out your rear end with bacteria. I would like a study of bacteria to virus in excrement, by the way, and the asymptomatic testing of covid has removed artifactual nature (sickness) of virion presentation correlation with sickness.
*/

//ostensious northern it

//love that fucking tire.. it's a drum kit, idiot

//free educaiton chore mercantilism without left over value//trade before surplus
//talaq padrone chore

//implausible use
//rollover
//exclusion if not fraud

//c'mon man. malarkey
//age related can diaper Uber 8% more to go
//20.1% developmentally disabled and injured
//school's out: shootings on the weekend
//free education, otherwise: wipo
//mercantilist without left over value

//I will not support insurance
//Implausible use rollover exclusion if not fraud is capitalist surplus value exchanged leisure
//no protestor for m4a doesn't have it.Response//anti-fiancne on
//anti-finance can only win as third party

//irv rcv for grifting non voters to biparti talaw

//abrogate finance "power for workers instead of corporate oppressors and ultra wealthy because they think they exploit instead of collab copp grift unerstatement."
//JB Rev Blackout
//finance cause starvation, left over value payment installs

//overhead labor ability needs surplus value over leisure

//everyone agree on ending insurance totally overlaps with reason for m4a chant rollover

//degrowth. majority of people want to ban insurance

//tax equally uniformly verticals important to eachother could be elastic fixed costs as ability meets needs

//mercantilist seek to maximize exports by importing labor not by surplus value left over effort but depreciating work

//you can code, I cannot even only but bartend

//be happy or else. spits* islamic bartender

//asylym conscripts. don't stop advocating

//"elected managers"
//huge talq from eachother
//we can protest with geohash above $15k/customer/yr by subsidiary (yet for worker?)

//talaq usurers go to Hell

//hourly wages are tipable not billable
//bundle exclusionary nor payment install left over effort value
