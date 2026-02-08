import Image from "next/image";

export default function ServiceFeatures() {
  const features = [
    {
      imageSrc: "/images/homeIcon1.png",
      title: "VERIFIED BOUTIQUES ONLY",
      description: "",
    },
    {
      imageSrc: "/images/homeIcon2.png",
      title: "BOOK INSTANTLY,",
      description: "NO WAITING",
    },
    {
      imageSrc: "/images/homeIcon3.png",
      title: "PICKUP LOCALLY",
      description: "OR SHIP FAST",
    },
    {
      imageSrc: "/images/homeIcon4.png",
      title: "LOYALTY REWARDS",
      description: "AND PERKS",
    },
    {
      imageSrc: "/images/homeIcon5.png",
      title: "OPTIONAL INSURANCE",
      description: "FOR PEACE OF MIND",
    },
  ];

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center ${index === 4 ? "col-span-2 sm:col-span-1" : ""}`}
            >
              <div className="mb-4 h-12 flex items-center justify-center">
                <Image
                  src={feature.imageSrc || "/placeholder.svg"}
                  alt={feature.title}
                  width={index >= 3 ? 45 : 35}
                  height={index >= 3 ? 45 : 35}
                  className="mx-auto"
                />
              </div>
              <h3 className={`text-sm font-inter tracking-wider mb-1 ${index >= 3 ? "font-medium" : "font-normal"}`}>
                {feature.title}
              </h3>
              {feature.description && (
                <p className="text-sm tracking-wider">{feature.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
