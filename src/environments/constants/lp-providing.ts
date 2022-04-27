export interface LpProvidingConfig {
  contractAddress: string;
  brbcAddress: string;
  usdcAddress: string;
  minEnterAmount: number;
  maxEnterAmount: number;
  poolSize: number;
  poolUSDC: number;
  poolBRBC: number;
  maxEnterAmountWhitelist: number;
  whitelistDuration: number;
  whitelist: string[];
}

const WHITELIST = [
  '0x8796e04d35ba0251fa71d9bc89937bed766970e3',
  '0x3483ed7d3444a311a7585f0e59c9a74d6c111218',
  '0xa6708e277703659fda62aa12403f952fcbe739fe',
  '0x2a2036fcf77491a980c0197baf33c785937db6f4',
  '0x54419c76bd2a09e5879159a31b5999355cccce60',
  '0xe3a2dcf5e9b4a89beec2eeb7026ec1c7e6f57f33',
  '0xb67c8be61573c405ebd4057d75e51b8854d6e305',
  '0x136c52ecc842d94158e1070fc43593af2e3fc937',
  '0x730ead69324cb4976ceb0ad1f80b8b86162f7a57',
  '0x2746ed1e1b8cad9171aecb488bd6524d652d4394',
  '0x36445ebc1b1f5c45fa7f5be69adcae1f7c6c31dd',
  '0xe9565f0844292d4d142718a4bd8a9de6f6aa610d',
  '0x004ccf2e878e7dc96b2e84990c8faa70901ab32c',
  '0xf0f30e0488d4c86a52d1b397a90b35f2adfe6fe5',
  '0x5df354e5eca794ea3ed257e7e0770999b62cb39a',
  '0x6d2021a7415fb19e24937d2f0a18b3e037ba5d2f',
  '0x1a9267648ddfdf1aa48e012c2e568933f0cab9a5',
  '0x921bfd37faf8c9bb053796be4a2fcbe3f6b048b5',
  '0x3d4a8ce61800b3a3aacf13aae2ddb18ae5d6c5ef',
  '0xf2a521a7f3ec5c35b10242a2d701f3ca60304b14',
  '0xc735f69ab3aa2a8126685d868e34cb5c36a986e3',
  '0xe3b2356c2393028e175c773a67ed80ff638cc02c',
  '0x5464d91c9614a750e66343505491c6bea3aafe60',
  '0x9d981ab3462488fbc132ad8333bfdc9c991412c0',
  '0x49a72fd77f38d247d7ea8a8549e2ed422e661f86',
  '0x2c2bea6682293d26669d71eff6cc37e112aaca5f',
  '0x3af13dde4e3fbb8976aff84424dc1bd57fee9585',
  '0x4e03e92e943f58d886c1b2ef68e78ca2116086fe',
  '0x34b4e20b145955bfb893c580584e815f52567620',
  '0x8d4b8930e5c6374d3965d5847dd76dfb705c297a',
  '0x7f30b6661c6b55720748be2397ac5c1027d8b7c7',
  '0x24615208e34c6bf01a48f54495cd0d20626e8d16',
  '0x2a9340b352c071a871025b97f5e985d89ad2a20e',
  '0xc8837749ed96789748949052542637b28fb105ca',
  '0xce5557ea1961a3b1023b1f4d9e194aa510c1ed4a',
  '0xc220d7c03634b8c56fa469f99df26f2e1eda66a8',
  '0xa581d275759abc4993de2d04226b1f95ddae2e8d',
  '0xfaa7349283dbbb2571fe7b2d79762ace94e7629d',
  '0x82f5b2bf3ca3d4f90166cd94e09d12d8939759a6',
  '0x5d39e4d4ce6fc8735f595dd0360f606aac6111c3',
  '0xece791dd08ecbb4500b998e97b1cee67023e0acb',
  '0xf9db11765b958562287d8bc00e773a6d43923308',
  '0x53fc89a14e10aef5cd154e3ea35b1ce9cd9d7659',
  '0xbc750e75c42d1d9d86772b7fcde00c6d33887518',
  '0xff2d9e67ef75aeb415a2942c19122d44ea445480',
  '0x7191bcceed9860a719e4b8ef622d420c10486b85',
  '0x6ef41d8ebdb31e1f8ba3d2e561e2e2b31256e000',
  '0x8d65925e6e60efc884a8e874f91633b75feb45f5',
  '0xc84d6122af01d8963b52423ddc85ccc357cf2325',
  '0x4a8776c55022dcd129fb56dc86dca9824be747f4',
  '0x82b6502d99468087fe621108694015f59ea7f21d',
  '0xcdeb56939784bde68f7625adee6fc784d3139ad1',
  '0xf29c44369a5151b34660b3a4bf7cc272e19f215b',
  '0x9156bc793547c2a73e0037fb003f78c00fcbd8a1',
  '0x087fc0000161ed3c0b365ff1b69dfb36e8b862a5',
  '0x1b776181a7f6ac0dbbbd771c301df1be0ce2c7fe',
  '0xd073d2742564490ef9cdf4b20daf12f1adf64258',
  '0x62c0ac8585a09dd1be7c8c5dec43482a944d5c2a',
  '0x978d165451aaf5ba912dc5c4296d4e850e1b57ff',
  '0x084bd80e08b2d46f7db2cd8b1771e39534f8a5e1',
  '0x1e022d311af2cdc1e40ad6b3b8315e07942695f9',
  '0x2e6b18586bf5574d0e5670b4ccf43844562165b6',
  '0x223dd1554b1030dea16920b3bca0df9588d49e19',
  '0xef1edea6a13f5a9eefd1796f1635dbc19f2a49be',
  '0xe79d5f9a5540060f9cc051c94ec6f4b1ea9cd080',
  '0x944093cfd53a5b5e9b19b51c81c4850189bda33d',
  '0x10665ad06240514d1c8b821dab62763e898bf84a',
  '0x120465b5718fa4201af0805881c5c0c94ce2a827',
  '0xac1f0e04e680300b3740e7831157d3267efb66e3',
  '0x15a3550f9c93daa211e2d069a82ecccd59d3e642',
  '0x00c3c018d27bdece781dc4ae6a6bd9feac619dcf',
  '0x8694eb88823039f7de8f5d9b1f12b0e3d7ba1620',
  '0x1db993c082173b9d0fc47de862d516cf597abab9',
  '0x2400044b4e3629429e6f54c8bb0d7c40a0f3bab1',
  '0x68233c99ae032779a57c958c9aee8aaba0e8d647',
  '0x649af31ac91d28b76a141e222d4978906f8cc5a8',
  '0x3f8af45ef8c33f1c26f7594214ff9cc53c8baccc',
  '0x463403bf5c7641ef3718dc1eaa78b4fb2fcd5337',
  '0xbfac80442205d779c27a48d44e3c03c068444aa6',
  '0x4208caed59c89f9e337eca245413062d553e92d9',
  '0x0b0a961b26d822d56da955afc87dfe3bfb2ea809',
  '0xe601df82c3715944cec935e1f0f0b8ab0caab052',
  '0xf7d988e66ecf8d30dbad54981d7d7b976a0642c4',
  '0xa595f99fd6786ff03bb077eb630e46e895d4d1fa',
  '0x25ef8e30af0fa89bf26f99f6bde4f9ac8a35fc59',
  '0xc99b9d4bbb924e3dec23db4a65cadd250845e8db',
  '0x1c192fbe418af7708ad36c2c1b9b1f2134dbbb77',
  '0x4fd088b603f724bfab6866f273351efee24bd5b7',
  '0xd2a86dd2db22e4b11457a1bc4a06c6b684317e0e',
  '0x7de7bc3fb92310da194f90b90803a255f3c149ae',
  '0x7aaaa838e89924389acaf16c4d09e45e6b5c618f',
  '0xde518cc0be927c2ba1139431f37dd89fe3c4b86c',
  '0x708d20ca7b58475a0134bd46004bf1d2b05f197d',
  '0x251f5e267a8c378b8d76359c74859eaef7bdd60a',
  '0x8f947e7483c99daf93997dea741bc642472e6a14',
  '0x7a931b9181777e167b5e347bfa4293b6be85835f',
  '0x1d2735a9f56f20374b08ac0152bc7731b7754003',
  '0x0952f82a449a726b0205a03308dbd0dcfd28b0b6',
  '0x8dbb02189dadffb83bfdf823635b1ab885096247',
  '0xe8d0876eade21a03293ba87e0ce745afd8d48f6c',
  '0x23ae424b49cfc9b98c225c4045492260e19a409c',
  '0x641fa6242924024f41b3b59a45d3446d1092725b',
  '0x4eac8072b4db64f0750c345757c914ce3a6b9252',
  '0x730ebfcbd3554de579e98c8a46cd7c3b0d02c2cb',
  '0xb3afa5ae8820a347d58c25db46140269ae42a72d',
  '0x6b7ca71e6bd395a0d39785773ec7295eadf80fe4',
  '0x62472ad9e4cd94eea2e7790015cac16ae35427cc',
  '0xae95730828b6b9016ee9d47dce553029439cec84',
  '0x0063a52aea29829d62406dc8515dcda1b5631b44',
  '0xb01cd6520933aa83a36ee60f14fb7aab6218ae44',
  '0x91cd02be0f0eb2a64ff86ae9d9bd10188891e584',
  '0xf593dda5bb946d09d495e6d0e99fbeb3c3068f48',
  '0x9fc341930292803620e5408abe85d343cf9ea004',
  '0x0b014b4c7dd73c2e2013ea5bacca5c4217070ff7',
  '0x7cec11d55a2a5425bd6c451cc357a0988f0b3834',
  '0x1d963a61767a3e84fe10451749b491bfa0f58bed',
  '0xaa6f774176b3531d226b1581baefeb6ca3548207',
  '0x7d9531ac95f73382782516aba6ae469ea09623bf',
  '0xeb58eb76fd90aec1230a79a51cbc443847598975',
  '0x48d7c9c6ffb868eb10de6348bc3c402d4f2785a1',
  '0x08e225b2fbe75062a2116568b059ddae0eb8b010',
  '0xef36a372420e3eea5cdf709112e0864fb42804e6',
  '0x38e7801b2ef714fb6d1c710c25eb9ad97b67dfcb',
  '0x3ce29c8d73a2c0ed377ad2ccf48a6ed8eb83a3e2',
  '0x3edf64b69eef8d1b1313cd25b81e40e9d60308fc',
  '0x34c186af43c0961c28ca8cfbca0c0784efadc936',
  '0x1427f237e4fad4d7519f68fb3903b4fe7957d8c5',
  '0xf170dd3b461b55115f6d04f71a0ed8eba5a81449',
  '0xabb350370077b90f856270479c5af112f4eb51e0',
  '0x351f585c9ec5c84e5e6bead6b0e7e4212a779f2e',
  '0x49ef00a432cad9237f7b75de791cbf336d0f526b',
  '0x7721763710ff34e3aabf81d0f40557b628065e64',
  '0x11f6c932b97524b431d3ed92fe58bbd12c1f39c9',
  '0x23ce36e5cc61c759e5ffb266d537f1b7fce80363',
  '0x2d9dee6f17c4967ed8b9693d0c6b0ee2c1bf4cc4',
  '0x3caedfa46b8e3e6682f70588f71d8e7e066a4cec',
  '0xa32356e3901f0a5b218641882db11676a3a6fd74',
  '0x4a39b222aec3c08207efc7e83c31245bdeeeccc3',
  '0xe310836ce98a1eb0fbcfa9b3214ec2a6bf269a4d',
  '0x15eafc29816b34fb8b15dc6727a26de4c4cb2df0',
  '0xa3670e10ce2ecb098f3d84b62e023196bd262773',
  '0x230ad716e4c5278658a65f4201f6330b8949d753',
  '0xdfc6a12aed20b750c2d6c7b994f067da4b1dec64',
  '0x20217a2a3dc79d7b3a54ed5383960e09df945da7',
  '0x90ec84b187e53c9c17e34e2b908d8a541b5cdc6d',
  '0x6f95c071b52c05c889fcffcb580cc2ba5c801e99',
  '0xd95db8f314377bc0b2362a9dc8fa3c056c884910',
  '0x56a38f34a7e1cc0e3ef881b55f2c69b40353ea30',
  '0x8bc58b58757036eb6c0f84520b6de2cfd54abf96',
  '0x50b82550d5a749cc10a388455cb732ef80dc7cc6',
  '0x7181784ddf79ec0951d610bae3395576e0dad52a',
  '0x3fe9c35675836522745a862454ec38514a07e0e3',
  '0x69f1cb3df9cc396697799d4b8631773e441c7b5f',
  '0x0a3e46e2b87ad780020b5bfc9b6f8abdd11a8277',
  '0x7c4f4ef7348abb243a4c3754de6ea999412da974',
  '0x579668cd0278b0aa02df860ae3ec30c1fa382519',
  '0x050eab5decfbef8fbd9d9d0e7897116fd590706e',
  '0xe6b6da7749276889307fe4431d68d966262ecf11',
  '0xd23e7816ebaa02722e91b2dfaadc19e8d752225c',
  '0x61e722c09ad1f625de6f2a1543577a67faf31119',
  '0xad514b0b9e4d5dbe5e77cb45b4eecf2fc7c4794d',
  '0x1f8e92abfd3b1edc47bb0669997cd8808ce28cd8',
  '0x6a706ebe9700a96b4954c4030345d40ffd67f28a',
  '0xbb61b5a21cc8c1b61461fe2f22b54682b5c9f79e',
  '0xb20bf95f6925851ad8d341fe24609b12bcee49fc',
  '0x4c7f4cb013ebad4dcbcff1357de57c7bb2ef8233',
  '0x785deb2aefa6b848798868f4c3837f6f2afd56f1',
  '0x8d6fb83ff355a2c843c405383e27015991544c3b',
  '0xc87266e53e7d58f3295633115f199c23665ba49b',
  '0x7327b0c97cd3ad11c7051791aa36068a52170f3b',
  '0xf4ba068f3f79acbf148b43ae8f1db31f04e53861',
  '0xc7f048f7793b26fcbcf135d4a37c407d53d3177a',
  '0x700965eb67dc62d2a3eafce9ede4b2ec15217874',
  '0x1ef9b4bdd43e1b1814f064a77dd7124d34d69e0f',
  '0xe4b96bde124eed1677d31d0ca0ee0d6e44991800',
  '0x029bbc89b38ee8a4b25217414bb697e5cbe81438',
  '0x0d3174afb1d237f3964db6298cafb2966c1d39e3',
  '0xcf76424c528954e7ff537be9217a502181a51ec7',
  '0x425782b749f56578e9540ddbe47bda627ebdf5c6',
  '0x789eb786e30bbdebd0d002599cd544e6b98472e9',
  '0xa71e2669c07c97a9d3d55d2cf60544e7bf89156c',
  '0x2aca7b284ccb72127510d39b188b68823637d3c8',
  '0xb00c8b76c8856099d0a53fcf3d58f930e9b98d7e',
  '0xa11d3f22e2776a161890f29f5ec181b2adc95b0e',
  '0xa392177087f1637205abe91784c2276510788f93',
  '0x7d74c2dd573739dede2f82a4ce120abfdb873743',
  '0x2df8b0eb9dbd937f9ee8fd9ecd5e4c71983de1d6',
  '0xfca6f6a7ff40d9c6daf114ec306bfa0b9e75838d',
  '0xedb6995599378c6382ed8b516045277a6a2a97a9',
  '0x48304eea70ef3f6a02bd024a5da6f43e940d08a0',
  '0x34481931bf8c9bc8cb18ab86ec55db59ca1e2d64',
  '0x078b527f2f3918f008777cfc09645267cad1b2a1',
  '0x9fbf0a2ca4741fb3e6601f71b2dc8b61235e3e9c',
  '0xd771d7590958f39199162241b3ddd6e36b195a10',
  '0xefddf16918c924df69010788f408ccc5839a4f2e',
  '0x99890bdfba6d0a355c48c64105791082d2297915',
  '0xb2df4e5dbc0a86ddfe34192df6930d1d8bd29c41',
  '0x0de1d5c010dddafe0fc7e768e76e4c4c8bf05b77',
  '0x489310b412f59b4bb79d0c44fc7ade6de5d6581b',
  '0xb74cd3d43155eb57ed25ecb1ca0f301d0516c5fb',
  '0x6ea6e2b6dff760e355264877c6f274e21d113a57',
  '0x0fbbe0a3685023e2e68d611944ad228518ed5b97',
  '0x390be929c28d476fd93a78c9abe8a3a5e3c06f8c',
  '0x1887b781bddd14587a7c333671dae99ac771dbdf',
  '0xe71ce67b671d1e2bb1c1ad598be745500de3af67',
  '0x214ef8a4b97e7af4c2a8e7ce07a3c04596cefcce',
  '0x5cd5347f485a7973858f059849a0b6883a42cbb1',
  '0xdd05feee558cc252d340203dbf097d99905ddc55',
  '0x305d8a9a4ca094d045726319d6a5e7cf49475427',
  '0x8570c53319982fc9b587e7faa8b429907e702256',
  '0x5a3377b6c32d272d754a924f8b9da041d2e13ee6',
  '0x394e916f292ef09fa99881fb622597abaf98310d',
  '0x281fe4931d66033b7c6d88d6f9ce8ecce263b92e',
  '0xcbaddfe211ae3819d5e97cde4d25bb328f352ef4',
  '0x2590013ea6e651b747574edde2c377bcb7f888ff',
  '0x7aee63d31d83d3b86324e6f0ffdbd6568111ca43',
  '0xb3e2eb3180beaf883130849ef4ffabc737c0da8b',
  '0x5bab041808c3d041063f3973a26a483b0d3ac891',
  '0xb7d7b895e680050efc0a842d3ea674ddd66487a1',
  '0x0f943a6f978ac4d9f07842ebbbf1fc44e889f302',
  '0x3845601489945c5d94e2e224972f1eb6c70d8491',
  '0x951e6a43485c74118a35c1a1e8d8fdad8edab5a9',
  '0xfeab71ec60f02eb1112120eec40a5429b3deb823',
  '0x9f2b53e87637d29bf19754568d0918796fa6cb96',
  '0xcc1004304901bd943079f2e75b642b77a094293a',
  '0xddf6e9f1d4b76eb25d8ac1b270fcbb456a19bbf4',
  '0x393c352e290232c78dd1daa794d7176a135702ec',
  '0x21801be5399c4a86c5b0c8bb376e5dac2bff3777',
  '0x1a2d31825dcf0f231d7f8eee57b4c36151c7ab25',
  '0xe853ebb55fc658eca5c924968aa5cf04a1abe816',
  '0xbf5391e494e4589a75444e69e816d7d28177edc8',
  '0x7c28d29f5dfbbc5e1a452deceda3e9064883d42d',
  '0xbdfec88e52bedefd7e2bb6fe264f65ee3d603729',
  '0x9a6a5d62609f7db2aba226862857a89d3da020e3',
  '0x29cd88ada05f77aafde536310dee732b4d5bba21',
  '0xeb217f5cfe41c3f790d001649cb24000f4a2c879',
  '0x5352a6a8d3fedc8e40cb1281a56f9a0c0b52bf7e',
  '0xe662ad46d3b0cea9c735e48a2df500988bbf69ba',
  '0xf7e6bffb39746527661cc8b81cfc21230ef2cad2',
  '0xea5a576c1212f3f04032b6cd268491b76dec42ab',
  '0xf9270283150e22fc13884fd28aa94022117e3e2e',
  '0x3b948c5cc9a8d9339a39f7258ef17568e4c5ae92',
  '0x9eb70bc0a6a86bb63712f62d2836104f0a646413',
  '0x0ab9c6dda978a08a1c2642449a26e4910865d7d5',
  '0x47424da649d50aa22ef86f706a188b32b9568f6e',
  '0x58408cf2a1005f3ca75509cd620bc45feea2d4a6',
  '0xa90ed6f2d8f0796e03595f4de21bfba768d54ac4',
  '0xf322162fddb8553d105dac7d558bd48e966c5991',
  '0xe4c0de64fe32f7e5486db71aa1e93684d96233d4',
  '0xc4d2ff006f7bc4697d8633375daa34c645a40ce9',
  '0x95c1cf98fb5aafcc3e47ac1e65fc56d5a8e8361d',
  '0xcc191123590b2362f6580e339960d07334a70b04',
  '0xb418b68fc2bdeec06858e9d81a3f9cef6bc8a8ae',
  '0x0180a8688ca86e4048616c31271df6fd739dcddf'
];

export const LP_PROVIDING_CONFIG_DEVELOP: LpProvidingConfig = {
  contractAddress: '0xEF0b8AA0F1775867BE1106E07a1b7bC78D18F817',
  brbcAddress: '0x8E3BCC334657560253B83f08331d85267316e08a',
  usdcAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  minEnterAmount: 2000,
  maxEnterAmount: 20000,
  poolSize: 3200000,
  poolUSDC: 800000,
  poolBRBC: 3200000,
  maxEnterAmountWhitelist: 3200,
  whitelistDuration: 86400,
  whitelist: WHITELIST
};

export const LP_PROVIDING_CONFIG_PROD: LpProvidingConfig = {
  contractAddress: '0xEF0b8AA0F1775867BE1106E07a1b7bC78D18F817',
  brbcAddress: '0x8E3BCC334657560253B83f08331d85267316e08a',
  usdcAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  minEnterAmount: 2000,
  maxEnterAmount: 20000,
  poolSize: 3200000,
  poolUSDC: 800000,
  poolBRBC: 3200000,
  maxEnterAmountWhitelist: 3200,
  whitelistDuration: 86400,
  whitelist: WHITELIST
};
