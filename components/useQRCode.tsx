/* eslint-disable react-hooks/rules-of-hooks */
import { Fragment, useState, useEffect } from "react";
import MobileDetect from "mobile-detect";
import { Dialog, Transition } from "@headlessui/react";
import QRCode from "qrcode.react";
import { WechatIcon } from "./icons/WechatIcon";

interface QRcodeProps {
  url: string;
  description?: string;
  btnTitleMobile?: string;
}

export default function useQRCode({
  url,
  description,
  btnTitleMobile = "点击体验",
}: QRcodeProps) {
  if (typeof window !== "object") {
    return {
      QRCode: () => null,
      openQRCode: () => null,
      toggleQRCode: () => null,
      closeQRCode: () => null,
      isOpen: null,
    };
  }

  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    console.log('test')
    setIsMobile(!!new MobileDetect(window.navigator.userAgent).mobile());
  }, []);

  const content = () => (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-50 inset-0 overflow-y-auto"
        onClose={() => setIsOpen(false)}
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                {description &&
                  (typeof isMobile !== "boolean" ||
                    (typeof isMobile === "boolean" && !isMobile)) && (
                    <div className="mb-3 text-center">
                      <div className="mt-2">
                        <p className="text-md font-sm-bold text-black-500">
                          {description}
                        </p>
                      </div>
                    </div>
                  )}
                <div className="mx-auto flex items-center justify-center">
                  {typeof isMobile === "boolean" && isMobile ? (
                    <a
                      className="inline-flex items-center px-10 py-3 border border-transparent rounded-full text-base font-medium rounded-md text-white bg-green-600 focus:outline-none"
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <WechatIcon className="mr-2 h-6 w-6" aria-hidden="true" />
                      {btnTitleMobile}
                    </a>
                  ) : (
                    <QRCode
                      value={url}
                      renderAs="svg"
                      imageSettings={{
                        src: "/simonliang.jpg",
                        height: 24,
                        width: 24,
                        excavate: true,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );

  return {
    QRCode: content,
    openQRCode: () => setIsOpen(true),
    toggleQRCode: () => setIsOpen(!isOpen),
    closeQRCode: () => setIsOpen(false),
    isOpen,
  };
}
