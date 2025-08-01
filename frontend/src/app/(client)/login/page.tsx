'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { LoginRequest } from '@/types/user';
import { IcGoogle, IcKakao, IcNaver } from '@/assets';
import clsx from 'clsx';
import { useToastStore } from '@/stores/useToast';
import { loginUser } from '@/libs/login';
import { useAuthStore } from '@/stores/useAuthStore';

export default function LoginPage() {
  const { showToast } = useToastStore();
  const { setAccessToken, setAuthLoading } = useAuthStore();
  const router = useRouter();
  const methods = useForm<LoginRequest>({
    mode: 'all',
    defaultValues: { email: '', password: '' },
  });
  const {
    formState: { isValid },
  } = methods;
  const onSubmit = async (data: LoginRequest) => {
    const { email, password } = data;
    try {
      const res = await loginUser({ email, password });
      setAccessToken(res.accessToken);
      setAuthLoading(false);
      showToast('로그인을 완료했습니다.', 'success');
      router.push('/');
    } catch {
      showToast('로그인에 실패했습니다.', 'error');
    }
  };
  const onSocial = (sns: string) => {
    if (sns === 'kakao') {
      router.push(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/kakao`);
    }
    if (sns === 'naver') {
      router.push(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/naver`);
    }
    if (sns === 'google') {
      router.push(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/google`);
    }
  };
  const sns = [
    { name: 'kakao', value: '카카오', img: <IcKakao /> },
    { name: 'naver', value: '네이버', img: <IcNaver /> },
    { name: 'google', value: '구글', img: <IcGoogle /> },
  ];
  const INPUT_FIELDS = [
    {
      name: 'email',
      type: 'text',
      placeholder: '이메일을 입력해주세요.',
      label: '이메일',
      rules: {
        required: '이메일은 필수 입력입니다.',
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: '올바른 이메일 형식을 입력해주세요.',
        },
      },
    },
    {
      name: 'password',
      type: 'password',
      placeholder: '비밀번호를 입력해주세요.',
      label: '비밀번호',
      rules: {
        required: '비밀번호는 필수 입력입니다.',
        pattern: {
          value:
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
          message: '올바른 비밀번호 형식을 입력해주세요.',
        },
      },
    },
  ];

  return (
    <section className="mx-auto mt-10 mb-16 w-[380px]">
      <h4 className="mb-5 text-center text-xl font-bold text-[var(--text-bold)]">
        커넥트 시작하기
      </h4>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          noValidate
          className="flex w-full flex-col gap-5"
        >
          {INPUT_FIELDS.map((item) => (
            <div key={item.name} className="flex flex-col gap-2">
              <Input {...item} />
            </div>
          ))}

          <Button type="submit" disabled={!isValid}>
            로그인
          </Button>
        </form>
      </FormProvider>
      <div className="mt-5 mb-7 flex justify-center text-xs font-medium">
        <Link href="/id" className="border-r border-[var(--border-color)] px-4">
          아이디 찾기
        </Link>
        <Link
          href="/password"
          className="border-r border-[var(--border-color)] px-4"
        >
          비밀번호 찾기
        </Link>
        <Link href="/signup" className="px-4">
          회원가입
        </Link>
      </div>
      <div className="flex flex-col items-center">
        <hr className="relative -bottom-2 m-0 block h-px w-full border-none bg-[var(--border-color)]" />
        <span className="relative mb-4 bg-[var(--background)] px-2 text-xs">
          간편로그인
        </span>
        <div className="flex w-full flex-col gap-4">
          {sns.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => onSocial(item.name)}
              className={clsx(
                'flex h-[50px] w-full items-center justify-center rounded-[5px] text-sm font-bold',
                item.name === 'kakao' && 'bg-[#FAE500] text-[#392020]',
                item.name === 'naver' && 'bg-[#1EC800] text-white',
                item.name === 'google' &&
                  'bg-[#f8f8f8] text-[var(--text-bold)]',
              )}
            >
              {item.img}
              <span className="ml-2">{item.value}로 로그인</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
