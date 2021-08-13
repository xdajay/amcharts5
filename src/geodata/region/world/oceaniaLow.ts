import type { FeatureCollection } from "../../.internal/Geodata";

const map: FeatureCollection = {"type":"FeatureCollection", "features": [
{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[179.2223,-8.5541],[179.2023,-8.4653],[179.2307,-8.5048],[179.2223,-8.5541]]]},"properties":{"name":"Tuvalu","id":"TV","Continent":"Oceania"},"id":"TV"},
{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[166.6588,19.2828],[166.6087,19.3072],[166.6278,19.3245],[166.6588,19.3117],[166.6588,19.2828]]]},"properties":{"name":"Wake Island","id":"UM-WQ","Continent":"Oceania"},"id":"UM-WQ"},
{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[166.7458,-14.8263],[167.1316,-15.1348],[167.1995,-15.4855],[166.8257,-15.6351],[166.6313,-15.406],[166.5274,-14.8503],[166.7458,-14.8263]]]},"properties":{"name":"Vanuatu","id":"VU","Continent":"Oceania"},"id":"VU"},
{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[125.0679,-9.512],[124.9223,-8.9425],[125.178,-8.6478],[125.8043,-8.4924],[126.6198,-8.4596],[126.915,-8.7152],[125.4079,-9.2759],[125.0679,-9.512]]]},"properties":{"name":"Timor-Leste","id":"TL","Continent":"Oceania"},"id":"TL"},
{"type":"Feature","geometry":{"type":"MultiPolygon","coordinates":[[[[159.8793,-8.5341],[158.944,-8.041],[159.1096,-7.9038],[159.8433,-8.3273],[159.8793,-8.5341]]],[[[159.7505,-9.2728],[160.6254,-9.5888],[160.6494,-9.9288],[159.8535,-9.7917],[159.6218,-9.532],[159.7505,-9.2728]]],[[[160.7493,-8.3139],[160.9979,-8.6123],[161.2584,-9.3172],[160.8736,-9.1565],[160.5904,-8.373],[160.7493,-8.3139]]]]},"properties":{"name":"Solomon Islands","id":"SB","Continent":"Oceania"},"id":"SB"},
{"type":"Feature","geometry":{"type":"MultiPolygon","coordinates":[[[[152.9656,-4.7566],[152.6807,-4.4983],[152.5985,-3.9949],[153.1241,-4.2523],[152.9656,-4.7566]]],[[[155.9575,-6.6871],[155.7191,-6.8629],[155.344,-6.7217],[155.202,-6.3076],[154.782,-5.9706],[154.9969,-5.5401],[155.467,-6.1451],[155.8225,-6.3804],[155.9575,-6.6871]]],[[[151.9158,-4.2967],[152.4055,-4.3407],[152.4001,-4.7313],[152.0135,-5.0039],[152.1431,-5.3572],[151.8652,-5.5649],[151.515,-5.5521],[151.2291,-5.92],[150.4284,-6.2765],[149.6524,-6.2907],[149.1264,-6.1273],[148.4011,-5.7651],[148.3447,-5.545],[148.999,-5.4846],[149.2454,-5.5729],[150.2987,-5.5356],[150.953,-5.4233],[151.3268,-4.9604],[151.6713,-4.8836],[151.5518,-4.3456],[151.9158,-4.2967]]],[[[140.9761,-9.1187],[140.9752,-6.9055],[140.9743,-4.2266],[140.9735,-2.6095],[141.1856,-2.6277],[142.2115,-3.0836],[143.509,-3.4311],[144.0159,-3.7836],[144.4775,-3.8253],[145.0879,-4.3491],[145.3347,-4.3855],[145.767,-4.8232],[145.8527,-5.4713],[146.4036,-5.6164],[147.0344,-5.9192],[147.3766,-5.9502],[147.8018,-6.3151],[147.8453,-6.6627],[147.1191,-6.7217],[146.9607,-6.929],[147.1902,-7.3782],[147.7242,-7.8763],[148.1268,-8.1031],[148.2466,-8.5545],[148.5831,-9.0517],[149.2476,-9.0708],[149.2032,-9.4068],[149.8748,-10.0132],[150.6672,-10.2569],[150.4825,-10.6368],[150.0169,-10.5774],[149.7541,-10.3532],[147.7686,-10.07],[146.6966,-9.0251],[146.0334,-8.0765],[144.9738,-7.8021],[144.5099,-7.5673],[143.6137,-8.2003],[143.0948,-8.3113],[143.366,-8.9611],[142.6474,-9.3278],[142.2297,-9.1698],[141.1333,-9.2213],[140.9761,-9.1187]]]]},"properties":{"name":"Papua New Guinea","id":"PG","Continent":"Oceania"},"id":"PG"},
{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[134.5956,7.3821],[134.5064,7.4371],[134.5561,7.5938],[134.6595,7.6631],[134.5956,7.3821]]]},"properties":{"name":"Palau","id":"PW","Continent":"Oceania"},"id":"PW"},
{"type":"Feature","geometry":{"type":"MultiPolygon","coordinates":[[[[173.1152,-41.2791],[173.7376,-40.9888],[174.3026,-41.019],[174.0922,-41.5051],[174.2831,-41.7408],[173.5449,-42.5181],[173.2213,-42.9766],[172.7184,-43.2585],[172.9208,-43.8915],[172.3855,-43.8293],[171.4426,-44.136],[171.1133,-45.0394],[170.7005,-45.6843],[169.6866,-46.5517],[168.382,-46.6054],[167.682,-46.193],[166.7316,-46.1979],[166.7338,-45.5432],[167.1946,-44.9635],[168.3665,-44.0819],[168.8064,-43.9922],[169.6613,-43.5914],[170.3027,-43.1075],[170.7417,-42.9273],[171.2571,-42.4652],[171.4861,-41.795],[172.0108,-41.4447],[172.1396,-40.9471],[172.6407,-40.5183],[172.9892,-40.8481],[173.1152,-41.2791]]],[[[173.2693,-34.935],[173.8441,-35.0265],[174.3204,-35.2467],[174.391,-35.774],[174.802,-36.3093],[174.7226,-36.8411],[175.2996,-36.9934],[175.4608,-36.4758],[175.8762,-36.9579],[176.108,-37.645],[177.3358,-37.9908],[178.0091,-37.5549],[178.536,-37.6921],[178.2679,-38.551],[177.9763,-38.7223],[177.9656,-39.1427],[177.4077,-39.081],[176.954,-39.3678],[177.1098,-39.6732],[176.8422,-40.1579],[175.9828,-41.2135],[175.3098,-41.6107],[174.6356,-41.2894],[175.1625,-40.6213],[175.2543,-40.2893],[175.0093,-39.9524],[173.9342,-39.5094],[173.8441,-39.1396],[174.5974,-38.7849],[174.9281,-37.8044],[174.7292,-37.4488],[174.782,-36.9437],[174.4758,-36.9419],[174.4469,-36.4505],[173.9453,-36.1762],[173.1166,-35.2054],[173.2693,-34.935]]]]},"properties":{"name":"New Zealand","id":"NZ","Continent":"Oceania"},"id":"NZ"},
{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[166.9585,-0.5165],[166.9163,-0.5463],[166.9136,-0.4988],[166.9585,-0.5165]]]},"properties":{"name":"Nauru","id":"NR","Continent":"Oceania"},"id":"NR"},
{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[167.9395,-29.0175],[167.9794,-29.0757],[167.9204,-29.0828],[167.9395,-29.0175]]]},"properties":{"name":"Norfolk Island","id":"NF","Continent":"Oceania"},"id":"NF"},
{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[164.2023,-20.2462],[164.4358,-20.2822],[165.1918,-20.7691],[165.6627,-21.2672],[166.9425,-22.0901],[166.7742,-22.376],[165.2419,-21.5255],[164.4549,-20.829],[164.2023,-20.2462]]]},"properties":{"name":"New Caledonia","id":"NC","Continent":"Oceania"},"id":"NC"},
{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[145.752,15.1333],[145.6845,15.1249],[145.7133,15.2154],[145.7821,15.1746],[145.752,15.1333]]]},"properties":{"name":"Northern Mariana Islands","id":"MP","Continent":"Oceania"},"id":"MP"},
{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[171.1017,7.1384],[171.2269,7.0869],[171.2025,7.0736],[171.0955,7.1091],[171.1017,7.1384]]]},"properties":{"name":"Marshall Islands","id":"MH","Continent":"Oceania"},"id":"MH"},
{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[174.5086,-0.802],[174.4798,-0.7736],[174.4527,-0.6471],[174.4749,-0.6422],[174.5086,-0.802]]]},"properties":{"name":"Kiribati","id":"KI","Continent":"Oceania"},"id":"KI"},
{"type":"Feature","geometry":{"type":"MultiPolygon","coordinates":[[[[140.9735,-2.6095],[140.9743,-4.2266],[140.9752,-6.9055],[140.9761,-9.1187],[139.9347,-8.1009],[139.3857,-8.1888],[138.8561,-8.1453],[139.0878,-7.5873],[138.7478,-7.2517],[138.8645,-6.8584],[138.4388,-6.3431],[138.0611,-5.4651],[137.0894,-4.9244],[135.9797,-4.5311],[135.1962,-4.4508],[134.1473,-3.7965],[133.6532,-3.3646],[133.2488,-4.0619],[132.9688,-4.0948],[132.7539,-3.7037],[132.7512,-3.2949],[132.3482,-2.9753],[133.1911,-2.4377],[133.6088,-2.5474],[133.9213,-2.1021],[132.963,-2.2726],[132.3078,-2.2424],[132.0233,-1.9903],[131.9305,-1.5597],[131.2935,-1.3937],[131.2571,-0.8557],[131.8044,-0.7039],[132.1285,-0.454],[132.6252,-0.359],[133.4726,-0.7261],[133.9746,-0.7443],[134.2596,-1.363],[134.106,-1.7213],[134.1557,-2.1953],[135.0373,-3.333],[135.4865,-3.345],[136.2433,-2.5833],[136.3898,-2.2735],[136.843,-2.1976],[137.1236,-1.8411],[137.8063,-1.4833],[138.6497,-1.791],[139.7896,-2.348],[140.6223,-2.4457],[140.9735,-2.6095]]],[[[97.4814,1.465],[97.9319,0.974],[97.8764,0.6283],[97.4055,0.947],[97.4814,1.465]]],[[[124.889,0.9954],[124.4274,0.4707],[123.754,0.3055],[123.2653,0.3264],[123.0824,0.4858],[121.8422,0.4365],[121.4258,0.4946],[120.3489,0.4494],[120.1274,0.1666],[120.012,-0.307],[120.0972,-0.6502],[120.5176,-1.0395],[120.6676,-1.3702],[121.0338,-1.4066],[121.5194,-0.8557],[121.9691,-0.9334],[122.2798,-0.7571],[122.8888,-0.7554],[122.5067,-1.348],[121.7188,-1.8624],[121.8484,-2.3316],[122.3992,-3.2008],[122.2528,-3.6202],[122.8773,-4.109],[122.8973,-4.3491],[122.207,-4.4965],[121.9172,-4.848],[121.4866,-4.5813],[121.6175,-4.093],[120.9144,-3.5559],[121.052,-2.7515],[120.6539,-2.6676],[120.2539,-3.0529],[120.4368,-3.7068],[120.4199,-4.6177],[120.2792,-5.1463],[120.3116,-5.5418],[119.7172,-5.6932],[119.3768,-5.4251],[119.6116,-4.4237],[119.6236,-4.0344],[119.4194,-3.4755],[118.9946,-3.5377],[118.7837,-2.7649],[119.0922,-2.483],[119.3217,-1.9299],[119.3089,-1.4083],[119.7718,-0.4837],[119.8091,0.2385],[120.2694,0.9709],[120.5167,0.8178],[120.9122,1.2888],[121.5918,1.0677],[122.4365,1.018],[122.8924,0.8498],[123.2781,0.9279],[123.8468,0.8382],[124.2738,1.022],[124.9893,1.7011],[125.2339,1.5023],[124.889,0.9954]]],[[[127.7326,0.848],[128.161,1.1578],[128.4242,1.5174],[128.7025,1.1063],[128.299,0.8768],[128.6914,0.3601],[127.5555,0.4898],[127.4201,1.2519],[127.6318,1.8436],[128.0109,1.7011],[128.0118,1.3318],[127.7326,0.848]]],[[[116.5532,4.3596],[117.1005,4.337],[117.4507,4.1927],[117.6301,3.6361],[117.1662,3.5921],[117.6105,3.0643],[118.0664,2.3177],[117.8649,1.9684],[118.0806,1.7016],[118.9848,0.982],[118.5347,0.8134],[118.196,0.8742],[117.745,0.7299],[117.5222,0.2358],[117.4627,-0.3235],[117.5626,-0.7709],[116.5545,-1.474],[116.4236,-2.0529],[116.5656,-2.2997],[115.9561,-3.5949],[114.6937,-4.1698],[114.5361,-3.4946],[114.0825,-3.2789],[113.7953,-3.4564],[113.5258,-3.1839],[112.9714,-3.187],[112.6003,-3.4001],[112.2852,-3.3211],[111.8222,-3.5319],[111.8231,-3.0574],[111.3676,-2.9335],[111.0445,-3.0556],[110.574,-2.8914],[110.2326,-2.9251],[110.0191,-1.399],[109.7874,-1.0115],[109.454,-0.869],[109.1606,-0.4948],[109.2574,0.0312],[108.9444,0.3557],[108.9058,0.7938],[109.0758,1.4956],[109.3786,1.9226],[110.5056,0.8622],[110.9384,1.0171],[111.7698,0.9993],[112.0783,1.1432],[112.476,1.5591],[113.6222,1.2359],[113.9023,1.4348],[114.5459,1.4672],[114.8304,1.9799],[114.7865,2.2502],[115.1509,2.493],[115.0861,2.8411],[115.4545,3.0341],[115.5686,3.9392],[115.8962,4.3485],[116.5532,4.3596]]],[[[96.4924,5.2292],[97.4512,5.2358],[97.9084,4.8798],[98.2484,4.4146],[98.3074,4.0928],[99.7319,3.1828],[100.4572,2.2573],[100.6854,2.1202],[101.0463,2.2573],[101.4768,1.6931],[101.7849,1.6212],[102.4694,0.7792],[103.0664,0.492],[103.4788,0.48],[103.7868,0.0468],[103.4286,-0.1912],[103.4313,-0.5334],[103.7211,-0.8868],[104.3608,-1.0386],[104.6684,-2.3858],[105.3968,-2.3804],[106.0445,-3.1062],[105.8438,-3.6136],[105.8873,-5.0096],[105.8163,-5.6768],[105.3493,-5.5494],[105.0812,-5.7456],[104.6396,-5.5205],[104.6014,-5.9041],[103.8312,-5.0798],[102.5377,-4.152],[102.1276,-3.5994],[101.5785,-3.167],[100.8478,-2.1439],[100.8554,-1.9343],[100.3081,-0.8268],[99.5978,0.1022],[99.1593,0.3517],[98.7962,1.4947],[98.5645,1.9022],[97.7006,2.3585],[97.591,2.8464],[96.9691,3.5752],[96.4449,3.8163],[95.4949,4.7613],[95.2069,5.2838],[95.2277,5.5652],[95.629,5.6096],[96.1333,5.294],[96.4924,5.2292]]],[[[120.0124,-9.3748],[120.5038,-9.674],[120.8327,-10.0371],[120.439,-10.2942],[120.1447,-10.2001],[119.6009,-9.773],[119.0856,-9.7069],[119.1855,-9.3846],[120.0124,-9.3748]]],[[[125.0679,-9.512],[124.4274,-10.1486],[123.8574,-10.3434],[123.5893,-9.967],[123.7092,-9.615],[124.0363,-9.3416],[124.4442,-9.1902],[124.9223,-8.9425],[125.0679,-9.512]]],[[[116.6406,-8.614],[116.3774,-8.9292],[116.0764,-8.745],[116.0613,-8.4374],[116.4014,-8.2043],[116.6406,-8.614]]],[[[122.7828,-8.6118],[121.6513,-8.899],[121.0352,-8.9354],[119.8078,-8.6975],[119.9183,-8.4453],[120.6104,-8.2407],[121.4444,-8.5781],[121.9664,-8.4547],[122.263,-8.6251],[122.6034,-8.4027],[122.7828,-8.6118]]],[[[118.2426,-8.3179],[118.9879,-8.3379],[119.0061,-8.7499],[118.1898,-8.8404],[117.0614,-9.0992],[116.7884,-9.0064],[116.8351,-8.5323],[117.1649,-8.3668],[117.567,-8.4267],[118.1175,-8.1222],[118.2426,-8.3179]]],[[[115.4479,-8.155],[115.7045,-8.4072],[115.2362,-8.7978],[114.4753,-8.1195],[115.4479,-8.155]]],[[[138.5352,-8.2736],[138.2963,-8.4054],[137.6851,-8.2625],[138.0074,-7.6415],[138.2955,-7.4386],[138.77,-7.3907],[138.9893,-7.6961],[138.5352,-8.2736]]],[[[131.3255,-7.9997],[131.0866,-7.8652],[131.2602,-7.4706],[131.6912,-7.439],[131.3255,-7.9997]]],[[[113.8445,-7.1052],[113.4708,-7.2184],[112.7637,-7.1399],[112.868,-6.9002],[113.9746,-6.8726],[113.8445,-7.1052]]],[[[134.5366,-6.4425],[134.3559,-6.8149],[134.0589,-6.7692],[134.1681,-6.1762],[134.5366,-6.4425]]],[[[107.3739,-6.0075],[107.6669,-6.2152],[108.295,-6.2649],[108.6776,-6.7905],[110.4261,-6.9472],[110.7369,-6.4722],[111.1546,-6.6693],[111.5403,-6.6485],[112.0872,-6.8935],[112.5391,-6.9263],[112.7943,-7.5527],[113.2484,-7.7183],[114.0705,-7.633],[114.4442,-7.8958],[114.387,-8.4054],[114.5836,-8.7698],[113.2533,-8.2869],[112.6789,-8.4089],[111.5101,-8.3051],[110.6072,-8.1497],[110.0386,-7.8905],[109.2818,-7.7049],[108.7411,-7.6672],[108.4517,-7.7964],[107.9173,-7.724],[107.2852,-7.4719],[106.6317,-7.4155],[106.5199,-7.0537],[105.4838,-6.7816],[106.0751,-5.9143],[106.8253,-6.0985],[107.0463,-5.9041],[107.3739,-6.0075]]],[[[134.747,-5.707],[134.7559,-6.1704],[134.4411,-6.3351],[134.3413,-5.7127],[134.747,-5.707]]],[[[122.6452,-5.2693],[122.3691,-4.7673],[122.702,-4.6186],[122.6452,-5.2693]]],[[[126.8612,-3.088],[127.2275,-3.3912],[127.2297,-3.6331],[126.6863,-3.8235],[126.2145,-3.6051],[126.0263,-3.1706],[126.8612,-3.088]]],[[[129.7545,-2.8661],[130.3791,-2.9895],[130.8598,-3.5705],[130.8052,-3.8577],[129.8442,-3.3273],[129.4678,-3.4533],[128.9675,-3.3259],[128.4193,-3.416],[128.0819,-3.1839],[128.1987,-2.8661],[129.4274,-2.7906],[129.7545,-2.8661]]],[[[108.2071,-2.9979],[107.6145,-3.2096],[107.6665,-2.566],[108.0744,-2.5971],[108.2071,-2.9979]]],[[[124.9694,-1.7057],[124.4176,-2.0054],[124.3808,-1.6871],[124.9694,-1.7057]]],[[[135.4741,-1.5916],[136.2016,-1.6551],[136.1927,-1.8593],[135.4741,-1.5916]]],[[[106.0458,-1.6693],[106.3659,-2.4648],[106.6788,-2.704],[106.547,-3.0556],[105.9988,-2.8248],[105.7857,-2.1816],[105.1332,-2.0426],[105.5855,-1.5268],[106.0458,-1.6693]]],[[[128.153,-1.6604],[127.5617,-1.7284],[127.6465,-1.3324],[128.153,-1.6604]]],[[[99.1637,-1.7776],[98.8743,-1.664],[98.6017,-1.1979],[98.869,-0.9156],[99.2671,-1.6276],[99.1637,-1.7776]]],[[[135.3831,-0.6515],[135.8936,-0.7261],[135.839,-1.1194],[135.3831,-0.6515]]]]},"properties":{"name":"Indonesia","id":"ID","Continent":"Asia"},"id":"ID"},
{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[144.7417,13.2592],[144.6493,13.4292],[144.7905,13.5269],[144.7417,13.2592]]]},"properties":{"name":"Guam","id":"GU","Continent":"Oceania"},"id":"GU"},
{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[158.315,6.8134],[158.1836,6.801],[158.1348,6.9448],[158.2946,6.951],[158.315,6.8134]]]},"properties":{"name":"Federated States of Micronesia","id":"FM","Continent":"Oceania"},"id":"FM"},
{"type":"Feature","geometry":{"type":"MultiPolygon","coordinates":[[[[178.2804,-17.372],[178.5915,-17.6517],[178.6679,-18.0805],[177.8471,-18.2545],[177.3216,-18.0769],[177.2638,-17.8634],[177.6181,-17.4612],[178.2804,-17.372]]],[[[179.9991,-16.1686],[179.7483,-16.4465],[179.9281,-16.7444],[179.007,-16.9002],[178.805,-16.6312],[179.5517,-16.2499],[179.9991,-16.1686]]]]},"properties":{"name":"Fiji","id":"FJ","Continent":"Oceania"},"id":"FJ"},
{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[105.7253,-10.493],[105.6969,-10.5636],[105.5842,-10.5126],[105.7053,-10.4304],[105.7253,-10.493]]]},"properties":{"name":"Christmas Island","id":"CX","Continent":"Oceania"},"id":"CX"},
{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[96.8404,-12.182],[96.8519,-12.1869],[96.8675,-12.1816],[96.8737,-12.1878],[96.8497,-12.1976],[96.8404,-12.182]]]},"properties":{"name":"Cocos (Keeling) Islands","id":"CC","Continent":"Oceania"},"id":"CC"},
{"type":"Feature","geometry":{"type":"MultiPolygon","coordinates":[[[[145.0431,-40.7869],[145.2832,-40.77],[146.3175,-41.1637],[147.4547,-41.0017],[147.9687,-40.7798],[148.2928,-40.9471],[148.3017,-42.04],[147.9244,-42.5727],[147.9807,-43.1573],[147.4081,-42.894],[146.8741,-43.6122],[146.0431,-43.5474],[145.2681,-42.5442],[145.2384,-42.0196],[144.7776,-41.419],[144.6458,-40.9809],[145.0431,-40.7869]]],[[[137.5963,-35.7385],[137.4485,-36.075],[136.7551,-36.0332],[136.6388,-35.7491],[137.334,-35.5925],[137.5963,-35.7385]]],[[[136.7148,-13.804],[136.8945,-14.2932],[136.3632,-14.2288],[136.4249,-13.8648],[136.7148,-13.804]]],[[[130.6188,-11.3764],[131.2682,-11.1899],[131.5385,-11.4367],[130.9508,-11.9259],[130.645,-11.7426],[130.6188,-11.3764]]],[[[143.1787,-11.9548],[143.1104,-12.3037],[143.4015,-12.6401],[143.5866,-13.4436],[143.5485,-13.741],[143.7562,-14.3491],[143.9617,-14.4627],[144.4731,-14.2319],[144.648,-14.4925],[145.2876,-14.943],[145.2717,-15.4766],[145.4581,-16.0559],[145.4261,-16.4061],[145.902,-17.0697],[146.1257,-17.6352],[146.0325,-18.2731],[146.3335,-18.5537],[146.4813,-19.0788],[147.1387,-19.3931],[147.4183,-19.3784],[147.9155,-19.8694],[148.7593,-20.2897],[148.6839,-20.5805],[149.205,-21.1251],[149.7039,-22.4408],[150.0763,-22.1643],[150.5415,-22.5593],[150.7639,-22.5762],[150.843,-23.4582],[151.1537,-23.784],[151.9025,-24.2009],[152.1298,-24.5977],[152.4565,-24.8019],[152.9137,-25.4322],[153.1649,-25.9644],[153.0842,-26.304],[153.117,-27.1945],[153.5756,-28.2407],[153.6044,-28.8546],[153.3483,-29.2905],[153.2724,-29.8924],[153.0305,-30.5636],[152.9439,-31.435],[152.5595,-32.0458],[152.4703,-32.439],[151.8129,-32.9011],[151.4839,-33.3477],[151.2314,-34.0295],[150.9601,-34.2967],[150.6903,-35.1779],[150.1953,-35.833],[149.9605,-36.8451],[149.9325,-37.5287],[149.2987,-37.8021],[148.2626,-37.831],[147.3957,-38.219],[146.8568,-38.6633],[145.9353,-38.9017],[145.791,-38.6668],[144.6653,-38.2101],[143.5392,-38.8204],[142.6123,-38.4516],[141.725,-38.2713],[141.4244,-38.3637],[140.6272,-38.0281],[139.7843,-37.2459],[139.8575,-36.6622],[139.5481,-36.0963],[139.0376,-35.6892],[138.1845,-35.6124],[138.5112,-35.0243],[138.4899,-34.7637],[138.0895,-34.1698],[137.6918,-35.1432],[136.8834,-35.24],[137.0144,-34.916],[137.3908,-34.9133],[137.4938,-34.1609],[137.9319,-33.579],[137.8525,-33.2008],[137.4423,-33.1937],[137.2372,-33.6296],[136.4307,-34.0295],[135.6476,-34.9395],[135.1855,-33.907],[134.7909,-33.3282],[134.3013,-33.1653],[134.1002,-32.7489],[134.2343,-32.5487],[133.5511,-32.1829],[132.7575,-31.9561],[132.2146,-32.0071],[131.7214,-31.6964],[131.1435,-31.4958],[128.9462,-31.7022],[128.0677,-32.0666],[127.3198,-32.2641],[125.9171,-32.297],[124.126,-33.1293],[123.6506,-33.8364],[123.2076,-33.9878],[122.7774,-33.891],[122.1511,-33.9918],[121.4054,-33.8266],[119.854,-33.9749],[119.4505,-34.3682],[118.8952,-34.4801],[118.1357,-34.9865],[117.5817,-35.098],[116.5172,-34.9879],[115.9868,-34.7952],[115.7262,-34.5262],[115.0089,-34.2559],[115.1816,-33.6433],[115.5154,-33.5315],[115.6832,-33.1928],[115.6982,-31.6946],[115.1767,-30.8082],[114.9947,-30.2165],[114.9592,-29.4334],[114.5375,-28.543],[114.165,-28.0809],[114.0283,-27.3472],[113.5818,-26.5584],[113.5396,-25.6253],[114.2156,-26.2894],[114.2143,-25.8517],[113.4175,-24.4357],[113.5529,-23.733],[113.7571,-23.4183],[113.683,-22.6379],[113.9586,-21.9392],[114.3777,-22.3409],[114.8588,-21.7359],[115.4563,-21.4918],[116.0107,-21.0306],[116.7068,-20.6537],[117.4063,-20.7212],[118.1991,-20.3754],[118.7513,-20.2618],[119.1047,-19.9954],[119.5858,-20.0385],[120.8785,-19.6652],[121.4937,-19.1067],[121.8337,-18.4769],[122.2372,-17.9686],[122.1604,-17.3139],[122.9705,-16.4367],[123.5254,-17.4857],[123.778,-16.8678],[123.4903,-16.4909],[124.577,-16.1136],[124.3817,-15.758],[124.8389,-15.161],[125.2433,-14.9448],[125.1789,-14.7149],[125.6814,-14.3877],[126.021,-14.4947],[126.1115,-14.1143],[126.5696,-14.1609],[126.9034,-13.7441],[127.6727,-14.1951],[128.1996,-14.7517],[129.4589,-14.9333],[129.7536,-14.7895],[129.3786,-14.3926],[129.7097,-13.9802],[129.8389,-13.5732],[130.2597,-13.3024],[130.1682,-12.9575],[130.3999,-12.6881],[130.898,-12.5238],[131.0458,-12.1891],[131.4382,-12.2766],[132.3722,-12.2393],[132.5839,-12.1101],[132.6829,-11.5055],[133.0247,-11.4527],[133.1854,-11.7053],[133.904,-11.8322],[134.2369,-12.008],[134.7301,-11.9845],[135.218,-12.2215],[135.7884,-11.9073],[136.0818,-12.4226],[136.5403,-11.9579],[136.9474,-12.3498],[136.5372,-12.7844],[136.5945,-13.0037],[135.9273,-13.3042],[135.9894,-13.8102],[135.8833,-14.1534],[135.4053,-14.7584],[135.5309,-15.0003],[136.2052,-15.4034],[136.7844,-15.8943],[137.002,-15.8783],[137.7037,-16.2325],[138.2449,-16.7177],[139.0097,-16.8993],[139.2485,-17.3285],[140.036,-17.7027],[140.5114,-17.6246],[140.8305,-17.4146],[141.2189,-16.6463],[141.412,-16.0696],[141.6255,-15.0567],[141.4724,-13.7978],[141.6455,-13.2594],[141.6779,-12.4914],[141.9513,-11.8962],[142.1684,-10.9467],[142.4565,-10.7074],[142.8369,-11.3071],[142.8724,-11.8216],[143.1787,-11.9548]]]]},"properties":{"name":"Australia","id":"AU","Continent":"Oceania"},"id":"AU"}
]};

export default map;
