// com.server.security.JwtAuthenticationFilter.java

package com.server.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserDetailsService userDetailsService;  // UserDetailsService 주입

    // 인증이 필요 없는 엔드포인트 목록 (와일드카드 포함 가능)
    private static final List<String> EXCLUDE_URLS = List.of(
            "/api/auth/**",
            "/api/users/register",
            "/api/login",
            "/api/tags/**",
            "/uploads/**"
    );

    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    /**
     * 요청이 인증이 필요 없는 엔드포인트인지 확인하는 메소드
     *
     * @param request HTTP 요청
     * @return 인증이 필요 없는 경우 true, 그렇지 않으면 false
     */
    private boolean isExcluded(HttpServletRequest request) {
        String requestPath = request.getRequestURI();
        return EXCLUDE_URLS.stream().anyMatch(pattern -> pathMatcher.match(pattern, requestPath));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        try {
            // 인증이 필요 없는 엔드포인트는 필터링하지 않음
            if (isExcluded(request)) {
                filterChain.doFilter(request, response);
                return;
            }

            String token = getTokenFromRequest(request);
            logger.debug("Extracted Token: {}", token); // 디버깅용 로그

            if (StringUtils.hasText(token) && tokenProvider.validateToken(token)) {
                String username = tokenProvider.getUsernameFromToken(token);
                logger.debug("Valid Token for User: {}", username); // 디버깅용 로그

                // UserDetails 가져오기
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                // 인증 정보를 SecurityContext에 설정
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                logger.warn("Invalid or missing token for request URI: {}", request.getRequestURI());
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }

        filterChain.doFilter(request, response);
    }

    /**
     * HTTP 요청 헤더에서 JWT 토큰을 추출하는 메소드
     *
     * @param request HTTP 요청
     * @return 추출된 JWT 토큰 또는 null
     */
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer " 이후의 토큰 부분 반환
        }
        return null;
    }
}
