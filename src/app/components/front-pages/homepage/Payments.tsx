import Image from "next/image";

export const PaymentOptions = () => {
  const paymentOptions = [
    {
      key: "option1",
      img: "/images/front-pages/payments/visa.svg",
    },
    {
      key: "option2",
      img: "/images/front-pages/payments/master.svg",
    },
    {
      key: "option3",
      img: "/images/front-pages/payments/american-exp.svg",
    },
    {
      key: "option4",
      img: "/images/front-pages/payments/discover.svg",
    },
    {
      key: "option5",
      img: "/images/front-pages/payments/paypal.svg",
    },
    {
      key: "option6",
      img: "/images/front-pages/payments/maesro.svg",
    },
    {
      key: "option7",
      img: "/images/front-pages/payments/jcb.svg",
    },
    {
      key: "option8",
      img: "/images/front-pages/payments/dinners-clb.svg",
    },
  ];
  return (
    <>
      <div className="px-4 pt-12 dark:bg-dark">
        <p className="text-base text-ld opacity-90 text-center mb-8">
          Secured payment with PayPal & Razorpay
        </p>
        <div className="flex flex-wrap items-center justify-center md:gap-14 gap-7">
          {paymentOptions.map((item) => {
            return (
              <Image
                key={item.key}
                src={item.img}
                alt="payment"
                width={94}
                height={28}
                className="max-h-8"
              />
            );
          })}
        </div>
      </div>
    </>
  );
};
