import Image from "next/image";

const companies = [
  {
    img: "https://cdn.hiilbox.com/2026/06/Kaash-Plus-Payment-Method.webp",
    key: "paymentMethod1",
  },
  {
    img: "https://cdn.hiilbox.com/2026/06/Sahal-Payment-Method.webp",
    key: "paymentMethod2",
  },
  {
    img: "https://cdn.hiilbox.com/2026/06/My-Cash-Payment-Method.webp",
    key: "paymentMethod3",
  },
  {
    img: "https://cdn.hiilbox.com/2026/06/Premier-Wallet-Payment-Method.webp",
    key: "paymentMethod4",
  },
  {
    img: "https://cdn.hiilbox.com/2026/06/Apple-Pay-Payment-Method.webp",
    key: "paymentMethod15",
  },
  {
    img: "https://cdn.hiilbox.com/2026/06/Google-Pay-Payment-Method.webp",
    key: "paymentMethod6",
  },
  {
    img: "https://cdn.hiilbox.com/2026/06/MasterCard-Payment-Method.webp",
    key: "paymentMethod7",
  },
  {
    img: "https://cdn.hiilbox.com/2026/06/Visa-Payment-Method.webp",
    key: "paymentMethod8",
  },
  {
    img: "https://cdn.hiilbox.com/2026/06/Zaad-Payment-Method.webp",
    key: "paymentMethod9",
  },
  {
    img: "https://cdn.hiilbox.com/2026/06/eDahab-Payment-Method.webp",
    key: "paymentMethod10",
  },
  {
    img: "https://cdn.hiilbox.com/2026/06/EVC-Plus-Payment-Method.webp",
    key: "paymentMethod11",
  },
  {
    img: "https://cdn.hiilbox.com/2026/06/Jeeb-Payment-Method.webp",
    key: "paymentMethod12",
  },
];
const Companies = () => {
  return (
    <div className="dark:bg-dark">
      <div className="container-1218 mx-auto">
        <div className="border-ld border-t lg:py-14 py-7 overflow-hidden w-full">
          <div className="hiilbox-payment-marquee-track">
            {[0, 1].map((groupIndex) => (
              <div
                key={groupIndex}
                className="hiilbox-payment-marquee-set"
                aria-hidden={groupIndex === 1 ? "true" : undefined}
              >
                {companies.map((item) => (
                  <div key={`${groupIndex}-${item.key}`} className="shrink-0">
                    <Image
                      src={item.img}
                      alt="payment method"
                      width={190}
                      height={100}
                      className="h-auto w-auto shrink-0"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Companies;
